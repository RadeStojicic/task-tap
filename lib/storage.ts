import { decode } from "base64-arraybuffer";
import { supabase } from "./supabase";

const BUCKET = "report-photos";

export async function uploadReportPhoto(
  base64: string,
  mimeType: string = "image/jpeg",
): Promise<string> {
  const ext = (mimeType.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const path = `${Date.now()}-${Math.floor(Math.random() * 1e9)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, decode(base64), { contentType: mimeType, upsert: false });
  if (error) throw error;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return pub.publicUrl;
}
