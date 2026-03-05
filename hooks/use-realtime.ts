'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtime<T>(
  table: string,
  onUpdate: (payload: T) => void
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        onUpdate(payload.new as T);
      })
      .subscribe();

    setChannel(ch);
    return () => {
      supabase.removeChannel(ch);
    };
  }, [table, onUpdate]);

  return channel;
}
