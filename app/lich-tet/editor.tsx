'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ImagePlus, RotateCcw } from 'lucide-react';
import { drawCalendar, type Options } from './calendar';
import styles from './editor.module.css';

const initial: Options = { year: 2026, caption: 'Một năm sum vầy · Vạn điều hạnh phúc', zoom: 1, x: 50, y: 50 };
export default function CalendarEditor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [options, setOptions] = useState(initial);
  const [source, setSource] = useState('/images/hero.webp');
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('Ảnh mẫu có sẵn');
  useEffect(() => {
    let active = true;
    Promise.all([
      new FontFace('CalendarSerif', 'url(/fonts/Lora.woff2)').load(),
      new FontFace('CalendarSans', 'url(/fonts/BeVietnamPro-Regular.woff2)').load(),
    ]).then(fonts => { fonts.forEach(font => document.fonts.add(font)); if (active) setFontsReady(true); })
      .catch(() => { if (active) setError('Không tải được phông chữ. Vui lòng tải lại trang.'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.onload = () => { if (active) { setPhoto(img); setLoading(false); } };
    img.onerror = () => { if (active) { setError('Không đọc được ảnh. Hãy chọn ảnh JPG, PNG hoặc WebP khác.'); setLoading(false); } };
    img.src = source;
    return () => { active = false; if (source.startsWith('blob:')) URL.revokeObjectURL(source); };
  }, [source]);
  useEffect(() => {
    if (canvas.current && fontsReady) drawCalendar(canvas.current, photo, options, .5);
  }, [photo, options, fontsReady]);
  function upload(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 25 * 1024 * 1024) {
      setError('Chọn ảnh JPG, PNG hoặc WebP, tối đa 25 MB.'); return;
    }
    setError(''); setLoading(true); setPhoto(null); setFilename(file.name);
    setOptions(current => ({ ...current, zoom: 1, x: 50, y: 50 }));
    setSource(URL.createObjectURL(file));
  }
  async function download() {
    setExporting(true); setError('');
    try {
      const output = document.createElement('canvas');
      drawCalendar(output, photo, options, 2);
      const blob = await new Promise<Blob>((resolve, reject) => output.toBlob(value => value ? resolve(value) : reject(new Error('export')), 'image/png'));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `lich-tet-${options.year}.png`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch { setError('Chưa xuất được ảnh. Hãy thử lại hoặc dùng ảnh nhỏ hơn.'); }
    finally { setExporting(false); }
  }
  return <main className={styles.page}>
    <header className={styles.header}><a href="/"><ArrowLeft size={16} /> Thiệp cưới</a><span>LỊCH ẢNH / TẾT SUM VẦY</span></header>
    <div className={styles.workspace}>
      <section className={styles.controls} aria-labelledby="editor-title">
        <span className={styles.eyebrow}>MỘT TẤM ẢNH. CẢ NĂM THƯƠNG.</span>
        <h1 id="editor-title">Tết này,<br /><em>lịch của mình.</em></h1>
        <p>Đặt khoảnh khắc yêu thương vào tấm lịch hoa đào, để mỗi ngày đều có một điều đáng nhớ.</p>
        <div className={styles.form}>
          <label className={styles.upload}><ImagePlus size={24} /><strong>{loading ? 'Đang đọc ảnh…' : 'Chọn ảnh của bạn'}</strong><span>JPG, PNG, WebP · Tối đa 25 MB</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Chọn ảnh của bạn" onChange={event => { upload(event.target.files?.[0]); event.target.value = ''; }} />
          </label>
          <span className={styles.filename}>{filename}</span>
          <div className={styles.fields}>
            <label>Năm trên lịch<select value={options.year} onChange={e => setOptions({ ...options, year: Number(e.target.value) })}>{Array.from({ length: 201 }, (_, i) => 1900 + i).map(year => <option key={year}>{year}</option>)}</select></label>
            <label>Lời chúc<input maxLength={65} value={options.caption} onChange={e => setOptions({ ...options, caption: e.target.value })} /></label>
          </div>
          <fieldset className={styles.adjust}><legend>Căn chỉnh ảnh</legend>
            {([{ key: 'zoom', label: 'Phóng to', min: 1, max: 3, step: .01 }, { key: 'x', label: 'Trái / phải', min: 0, max: 100, step: 1 }, { key: 'y', label: 'Trên / dưới', min: 0, max: 100, step: 1 }] as const).map(item => <label key={item.key}>{item.label}<input type="range" min={item.min} max={item.max} step={item.step} value={options[item.key]} onChange={e => setOptions({ ...options, [item.key]: Number(e.target.value) })} /></label>)}
            <button className={styles.reset} onClick={() => setOptions({ ...options, zoom: 1, x: 50, y: 50 })}><RotateCcw size={14} /> Đặt lại vị trí</button>
          </fieldset>
          <button className={styles.download} disabled={loading || !photo || !fontsReady || exporting} onClick={download}><Download size={18} />{exporting ? 'Đang xuất lịch…' : 'Tải lịch PNG'}</button>
          <p className={styles.note}>3600 × 5400 px · Tỉ lệ 2:3 · Lịch dương<br />Ảnh chỉ xử lý trên thiết bị của bạn. Tải lại trang sẽ đặt lại bản chỉnh sửa.</p>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>
      </section>
      <section className={styles.preview} aria-label="Xem trước lịch">
        <div className={styles.previewHeading}><span>BẢN XEM TRƯỚC</span><span>HOA ĐÀO · 12 THÁNG</span></div>
        <div className={styles.scroll}><div className={styles.rod} /><canvas ref={canvas} role="img" aria-label={`Lịch năm ${options.year}, 12 tháng với ảnh đã chọn và lời chúc ${options.caption}`} /><div className={styles.rod} /></div>
        <p>Thanh treo chỉ minh họa, không nằm trong ảnh tải về.</p>
      </section>
    </div>
  </main>;
}
