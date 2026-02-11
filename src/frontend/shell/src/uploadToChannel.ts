import { storage } from './firebaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { authorizedFetch } from './authorizedFetch';

export async function uploadToChannel(
  file: File,
  guildId: string,
  channelId: string,
  messageId?: string,
) {
  const path = `guilds/${guildId}/channels/${channelId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);

  const snap = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snap.ref);

  const res = await authorizedFetch('http://localhost:3000/media', {
    method: 'POST',
    body: JSON.stringify({
      channelId,
      messageId: messageId ?? null,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      storagePath: path,
      downloadUrl,
    }),
  });

  return res.json();
}


