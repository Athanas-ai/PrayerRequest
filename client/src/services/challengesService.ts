import { supabase } from '@/lib/supabaseClient';
import { transformChallenge, transformChallenges, logSupabaseResponse, logMutationRequest } from '@/lib/dataTransform';

export interface Challenge {
  id: number;
  title: string;
  prayerType: string;
  totalTarget: number;
  currentCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateChallengeRequest {
  title: string;
  prayerType: string;
  totalTarget: number;
}

export async function fetchActiveChallenge(): Promise<Challenge | null> {
  console.log('🔍 Fetching active challenge...');
  
  const response = await supabase
    .from('challenges')
    .select('*')
    .eq('is_active', true)
    .single();

  logSupabaseResponse('fetchActiveChallenge', response);

  if (response.error) {
    // PGRST116 = no rows, which is fine for "active" challenge
    if (response.error.code === 'PGRST116') {
      console.log('ℹ️ No active challenge found');
      return null;
    }
    throw new Error(`Failed to fetch active challenge: ${response.error.message}`);
  }

  return transformChallenge(response.data);
}

export async function fetchAllChallenges(): Promise<Challenge[]> {
  console.log('🔍 Fetching all challenges...');
  
  const response = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });

  logSupabaseResponse('fetchAllChallenges', response);

  if (response.error) {
    throw new Error(`Failed to fetch challenges: ${response.error.message}`);
  }

  return transformChallenges(response.data || []);
}

export async function createChallenge(request: CreateChallengeRequest): Promise<Challenge> {
  const payload = {
    title: request.title,
    prayer_type: request.prayerType,
    total_target: request.totalTarget,
    current_count: 0,
    is_active: true,
  };

  logMutationRequest('createChallenge', { request, dbPayload: payload });

  const response = await supabase
    .from('challenges')
    .insert([payload])
    .select()
    .single();

  logSupabaseResponse('createChallenge', response);

  if (response.error) {
    console.error('❌ Insert failed. Check RLS policies:', response.error);
    throw new Error(`Failed to create challenge: ${response.error.message}`);
  }

  return transformChallenge(response.data);
}

export async function updateChallenge(
  challengeId: number,
  updates: Partial<CreateChallengeRequest> & { isActive?: boolean }
): Promise<Challenge> {
  const updateData: Record<string, any> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.prayerType !== undefined) updateData.prayer_type = updates.prayerType;
  if (updates.totalTarget !== undefined) updateData.total_target = updates.totalTarget;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

  logMutationRequest('updateChallenge', { id: challengeId, updates, dbPayload: updateData });

  const response = await supabase
    .from('challenges')
    .update(updateData)
    .eq('id', challengeId)
    .select()
    .single();

  logSupabaseResponse('updateChallenge', response);

  if (response.error) {
    console.error('❌ Update failed. Check RLS policies:', response.error);
    throw new Error(`Failed to update challenge: ${response.error.message}`);
  }

  return transformChallenge(response.data);
}

export async function deleteChallenge(challengeId: number): Promise<void> {
  logMutationRequest('deleteChallenge', { id: challengeId });

  const response = await supabase
    .from('challenges')
    .delete()
    .eq('id', challengeId);

  logSupabaseResponse('deleteChallenge', response);

  if (response.error) {
    console.error('❌ Delete failed. Check RLS policies:', response.error);
    throw new Error(`Failed to delete challenge: ${response.error.message}`);
  }
}

export async function incrementChallenge(challengeId: number, amount: number = 1): Promise<Challenge> {
  console.log(`🔍 Fetching challenge ${challengeId} before increment...`);

  const fetchResponse = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .single();

  logSupabaseResponse('incrementChallenge (fetch)', fetchResponse);

  if (fetchResponse.error) {
    throw new Error(`Challenge not found: ${fetchResponse.error.message}`);
  }

  const challenge = fetchResponse.data;
  const newCount = (challenge.current_count || 0) + amount;

  logMutationRequest('incrementChallenge', {
    id: challengeId,
    oldCount: challenge.current_count,
    newCount,
    amount,
  });

  const updateResponse = await supabase
    .from('challenges')
    .update({ current_count: newCount })
    .eq('id', challengeId)
    .select()
    .single();

  logSupabaseResponse('incrementChallenge (update)', updateResponse);

  if (updateResponse.error) {
    console.error('❌ Increment failed. Check RLS policies:', updateResponse.error);
    throw new Error(`Failed to increment challenge: ${updateResponse.error.message}`);
  }

  return transformChallenge(updateResponse.data);
}
