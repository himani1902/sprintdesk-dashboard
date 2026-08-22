import { toPng } from 'html-to-image';

export async function exportElementAsPng(elementId: string, filename: string = 'sprintdesk-analytics.png'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found for export.`);
    return;
  }

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor: document.documentElement.classList.contains('dark') ? '#0b1120' : '#ffffff',
      pixelRatio: 2,
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Error exporting chart image:', err);
  }
}
