import { supabase } from '@/lib/supabaseClient';
import { transformIntention, transformIntentions, logSupabaseResponse, logMutationRequest } from '@/lib/dataTransform';

export interface Intention {
  id: number;
  content: string;
  name?: string;
  prayerType?: string;
  hailMaryCount: number;
  ourFatherCount: number;
  rosaryCount: number;
  isPrinted: boolean;
  createdAt: string;
}

export interface CreateIntentionRequest {
  content: string;
  name?: string;
  prayerType?: string;
}

export async function fetchIntentions(): Promise<Intention[]> {
  console.log('🔍 Fetching all intentions...');
  
  const response = await supabase
    .from('intentions')
    .select('*')
    .order('created_at', { ascending: false });

  logSupabaseResponse('fetchIntentions', response);

  if (response.error) {
    throw new Error(`Failed to fetch intentions: ${response.error.message}`);
  }

  return transformIntentions(response.data || []);
}

export async function createIntention(request: CreateIntentionRequest): Promise<Intention> {
  const payload = {
    content: request.content,
    name: request.name || null,
    prayer_type: request.prayerType || null,
    hail_mary_count: 0,
    our_father_count: 0,
    rosary_count: 0,
    is_printed: false,
  };

  logMutationRequest('createIntention', { request, dbPayload: payload });

  const response = await supabase
    .from('intentions')
    .insert([payload])
    .select()
    .single();

  logSupabaseResponse('createIntention', response);

  if (response.error) {
    console.error('❌ Insert failed. Check RLS policies:', response.error);
    throw new Error(`Failed to create intention: ${response.error.message}`);
  }

  return transformIntention(response.data);
}

export async function incrementIntentionPrayer(
  intentionId: number,
  prayerType: 'hailMary' | 'ourFather' | 'rosary'
): Promise<Intention> {
  const columnMap = {
    hailMary: 'hail_mary_count',
    ourFather: 'our_father_count',
    rosary: 'rosary_count',
  };

  const column = columnMap[prayerType];

  console.log(`🔍 Fetching intention ${intentionId} before increment...`);

  const fetchResponse = await supabase
    .from('intentions')
    .select('*')
    .eq('id', intentionId)
    .single();

  logSupabaseResponse('incrementIntentionPrayer (fetch)', fetchResponse);

  if (fetchResponse.error) {
    throw new Error(`Intention not found: ${fetchResponse.error.message}`);
  }

  const intention = fetchResponse.data;
  const oldCount = intention[column] || 0;
  const newCount = oldCount + 1;

  const updateData = {
    [column]: newCount,
  };

  logMutationRequest('incrementIntentionPrayer', {
    id: intentionId,
    prayerType,
    column,
    oldCount,
    newCount,
    dbPayload: updateData,
  });

  const updateResponse = await supabase
    .from('intentions')
    .update(updateData)
    .eq('id', intentionId)
    .select()
    .single();

  logSupabaseResponse('incrementIntentionPrayer (update)', updateResponse);

  if (updateResponse.error) {
    console.error('❌ Increment failed. Check RLS policies:', updateResponse.error);
    throw new Error(`Failed to increment prayer: ${updateResponse.error.message}`);
  }

  return transformIntention(updateResponse.data);
}

export async function markIntentionPrinted(intentionId: number): Promise<Intention> {
  logMutationRequest('markIntentionPrinted', { id: intentionId });

  const response = await supabase
    .from('intentions')
    .update({ is_printed: true })
    .eq('id', intentionId)
    .select()
    .single();

  logSupabaseResponse('markIntentionPrinted', response);

  if (response.error) {
    console.error('❌ Update failed. Check RLS policies:', response.error);
    throw new Error(`Failed to mark as printed: ${response.error.message}`);
  }

  return transformIntention(response.data);
}
