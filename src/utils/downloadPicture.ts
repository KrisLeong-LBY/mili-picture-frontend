import { saveAs } from 'file-saver'

export default function downloadPicture(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}
