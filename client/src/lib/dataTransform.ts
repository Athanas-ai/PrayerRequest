/**
 * Data Transformation Helpers
 * Convert between Supabase snake_case columns and TypeScript camelCase properties
 */

/**
 * Transform Supabase challenge row (snake_case) to Challenge interface (camelCase)
 */
export function transformChallenge(dbRow: any): any {
  console.log('🔄 Transforming challenge row:', dbRow);
  
  if (!dbRow) return null;

  const transformed = {
    id: dbRow.id,
    title: dbRow.title,
    prayerType: dbRow.prayer_type,
    totalTarget: dbRow.total_target,
    currentCount: dbRow.current_count,
    isActive: dbRow.is_active,
    createdAt: dbRow.created_at,
  };

  console.log('✅ Challenge transformed:', transformed);
  return transformed;
}

/**
 * Transform array of Supabase challenge rows
 */
export function transformChallenges(dbRows: any[]): any[] {
  if (!dbRows) return [];
  const transformed = dbRows.map(transformChallenge);
  console.log('✅ Transformed', dbRows.length, 'challenges');
  return transformed;
}

/**
 * Transform Supabase intention row (snake_case) to Intention interface (camelCase)
 */
export function transformIntention(dbRow: any): any {
  console.log('🔄 Transforming intention row:', dbRow);
  
  if (!dbRow) return null;

  const transformed = {
    id: dbRow.id,
    content: dbRow.content,
    name: dbRow.name || undefined,
    prayerType: dbRow.prayer_type || undefined,
    hailMaryCount: dbRow.hail_mary_count || 0,
    ourFatherCount: dbRow.our_father_count || 0,
    rosaryCount: dbRow.rosary_count || 0,
    isPrinted: dbRow.is_printed || false,
    createdAt: dbRow.created_at,
  };

  console.log('✅ Intention transformed:', transformed);
  return transformed;
}

/**
 * Transform array of Supabase intention rows
 */
export function transformIntentions(dbRows: any[]): any[] {
  if (!dbRows) return [];
  const transformed = dbRows.map(transformIntention);
  console.log('✅ Transformed', dbRows.length, 'intentions');
  return transformed;
}

/**
 * Debug helper: Log Supabase query response
 */
export function logSupabaseResponse(operation: string, response: any) {
  const { data, error } = response;
  
  if (error) {
    console.error(`❌ ${operation} FAILED:`, {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  } else {
    console.log(`✅ ${operation} SUCCESS:`, {
      rowsAffected: Array.isArray(data) ? data.length : data ? 1 : 0,
      data: data,
    });
  }
  
  return response;
}

/**
 * Debug helper: Log mutation request
 */
export function logMutationRequest(operation: string, payload: any) {
  console.log(`📤 ${operation} REQUEST:`, payload);
  return payload;
}
