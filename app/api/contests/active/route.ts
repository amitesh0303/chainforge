import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .eq('status', 'active')
      .single();

    if (error) {
      return NextResponse.json({ contest: null });
    }
    return NextResponse.json({ contest: data });
  } catch {
    return NextResponse.json({ contest: null });
  }
}
