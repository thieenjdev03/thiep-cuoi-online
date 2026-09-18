'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ImagePlus, RotateCcw } from 'lucide-react';
import { drawCalendar, type Concept, type Crop, type Options, type Photo, type PhotoCount } from './calendar';
import styles from './editor.module.css';

const centered: Crop = { zoom: 1, x: 50, y: 50 };
const captions = { tet: 'Một năm sum vầy · Vạn điều hạnh phúc', wedding: 'Từ hôm nay, mình cùng nhau đi hết cuộc đời.', vintage: 'Duyên trăm năm — Tình vạn kiếp — Nghĩa một đời' };
const conceptLabels = { tet: 'Lịch Tết', wedding: 'Happy Wedding', vintage: 'Trăm năm hạnh phúc' };
const sampleSources = ['/images/hero.webp', ...Array.from({ length: 5 }, (_, i) => `/images/gallery-${i + 2}.webp`)];

async function loadImage(source: string) {
  const image = new Image();
  image.src = source;
  await image.decode();
  return image;
}

export default function CalendarEditor({ initialConcept = 'tet' }: { initialConcept?: Concept }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const objectUrls = useRef(new Set<string>());
  const mounted = useRef(false);
  const busy = useRef(true);
  const [options, setOptions] = useState<Options>({ concept: initialConcept, showCalendar: initialConcept === 'tet', count: initialConcept === 'tet' ? 1 : 4, year: 2026, caption: captions[initialConcept], names: 'Tên chú rể & Tên cô dâu', date: '' });
  const [photos, setPhotos] = useState<Photo[]>(() => sampleSources.map(() => ({ ...centered, image: null, name: 'Ảnh mẫu có sẵn' })));
  const [selected, setSelected] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [downloadFile, setDownloadFile] = useState<{ url: string; name: string } | null>(null);
  const wedding = options.concept !== 'tet';
  const withCalendar = !wedding || options.showCalendar;
  const activePhoto = photos[selected];
  const ready = fontsReady && photos.slice(0, options.count).every(photo => photo.image);

  useEffect(() => {
    let active = true;
    mounted.current = true;
    const urls = objectUrls.current;
    Promise.all([
      new FontFace('CalendarSerif', 'url(/fonts/Lora.woff2)').load(),
      new FontFace('CalendarSans', 'url(/fonts/BeVietnamPro-Regular.woff2)').load(),
    ]).then(fonts => { fonts.forEach(font => document.fonts.add(font)); if (active) setFontsReady(true); })
      .catch(() => { if (active) setError('Không tải được phông chữ. Vui lòng tải lại trang.'); });
    Promise.allSettled(sampleSources.map(loadImage)).then(results => {
      if (!active) return;
      setPhotos(results.map(result => ({ ...centered, image: result.status === 'fulfilled' ? result.value : null, name: result.status === 'fulfilled' ? 'Ảnh mẫu có sẵn' : 'Chưa có ảnh' })));
      setLoading(false); busy.current = false;
      if (results.some(result => result.status === 'rejected')) setError('Một số ảnh mẫu chưa tải được. Bạn có thể chọn ảnh của mình vào các ô trống.');
    });
    return () => { active = false; mounted.current = false; urls.forEach(URL.revokeObjectURL); urls.clear(); };
  }, []);
  useEffect(() => {
    if (canvas.current && fontsReady) drawCalendar(canvas.current, photos, options, .5);
  }, [photos, options, fontsReady]);

  useEffect(() => () => { if (downloadFile) URL.revokeObjectURL(downloadFile.url); }, [downloadFile]);

  async function upload(files: File[], start: number, maximum: number) {
    if (!files.length || busy.current) return;
    if (files.length > maximum) { setError(`Chọn tối đa ${maximum} ảnh cho bố cục này.`); return; }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 25 * 1024 * 1024)) {
      setError('Mỗi ảnh phải là JPG, PNG hoặc WebP, tối đa 25 MB.'); return;
    }
    busy.current = true; setLoading(true); setError('');
    const urls = files.map(file => URL.createObjectURL(file));
    urls.forEach(url => objectUrls.current.add(url));
    try {
      const images = await Promise.all(urls.map(loadImage));
      if (!mounted.current) return;
      const next = [...photos];
      images.forEach((image, index) => {
        const oldSource = next[start + index].image?.src;
        if (oldSource && objectUrls.current.delete(oldSource)) URL.revokeObjectURL(oldSource);
        next[start + index] = { ...centered, image, name: files[index].name };
      });
      setPhotos(next); setSelected(start);
    } catch {
      urls.forEach(url => { URL.revokeObjectURL(url); objectUrls.current.delete(url); });
      if (mounted.current) setError('Không đọc được ảnh. Các ảnh cũ vẫn được giữ; hãy chọn JPG, PNG hoặc WebP khác.');
    } finally {
      busy.current = false;
      if (mounted.current) setLoading(false);
    }
  }
  function updateCrop(crop: Partial<Crop>) {
    setPhotos(current => current.map((photo, index) => index === selected ? { ...photo, ...crop } : photo));
  }
  async function download() {
    setExporting(true); setError('');
    try {
      const output = document.createElement('canvas');
      drawCalendar(output, photos, options, 2);
      const blob = await new Promise<Blob>((resolve, reject) => output.toBlob(value => value ? resolve(value) : reject(new Error('export')), 'image/png'));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = `${wedding ? `${options.concept === 'vintage' ? 'tram-nam-hanh-phuc' : 'happy-wedding'}${withCalendar ? `-lich-${options.year}` : ''}` : `lich-tet-${options.year}`}-${options.count}-anh.png`;
      document.body.appendChild(link); link.click(); link.remove();
      setDownloadFile({ url, name: link.download });
    } catch { setError('Chưa xuất được ảnh. Hãy thử lại hoặc dùng ảnh nhỏ hơn.'); }
    finally { setExporting(false); }
  }
  return <main className={styles.page}>
    <header className={styles.header}><a href="/"><ArrowLeft size={16} /> Thiệp cưới</a><span>{wedding ? `${conceptLabels[options.concept].toUpperCase()} / KỶ NIỆM` : 'LỊCH ẢNH / TẾT SUM VẦY'}</span></header>
    <div className={styles.workspace}>
      <section className={styles.controls} aria-labelledby="editor-title">
        <span className={styles.eyebrow}>{wedding ? 'MỘT NGÀY ĐẸP. MỘT ĐỜI BÊN NHAU.' : 'MỘT TẤM ẢNH. CẢ NĂM THƯƠNG.'}</span>
        <h1 id="editor-title">{wedding ? 'Ngày chung đôi,' : 'Tết này,'}<br /><em>{wedding ? 'chuyện của mình.' : 'lịch của mình.'}</em></h1>
        <p>{wedding ? 'Ghép những khoảnh khắc yêu thương thành một tấm poster cưới dành riêng cho hai bạn.' : 'Đặt khoảnh khắc yêu thương vào tấm lịch hoa đào, để mỗi ngày đều có một điều đáng nhớ.'}</p>
        <div className={styles.form}>
          <fieldset className={styles.choices}><legend>Concept</legend>
            {(['tet', 'wedding', 'vintage'] as const).map(concept => <button key={concept} aria-pressed={options.concept === concept} onClick={() => setOptions(current => ({ ...current, concept, caption: current.caption === captions[current.concept] ? captions[concept] : current.caption }))}>{conceptLabels[concept]}</button>)}
          </fieldset>
          {wedding && <label className={styles.calendarToggle}><input type="checkbox" checked={options.showCalendar} onChange={e => setOptions({ ...options, showCalendar: e.target.checked })} /> Thêm lịch 12 tháng vào thiết kế</label>}
          <fieldset className={styles.choices}><legend>Bố cục ảnh</legend>
            {([1, 4, 6] as PhotoCount[]).map(count => <button key={count} disabled={loading} aria-pressed={options.count === count} onClick={() => { setOptions({ ...options, count }); setSelected(0); }}>{count} ảnh</button>)}
          </fieldset>
          <label className={styles.upload}><ImagePlus size={24} /><strong>{loading ? 'Đang đọc ảnh…' : `Chọn ${options.count === 1 ? 'ảnh' : `tối đa ${options.count} ảnh`} của bạn`}</strong><span>JPG, PNG, WebP · Tối đa 25 MB / ảnh</span>
            <input type="file" multiple={options.count > 1} disabled={loading} accept="image/jpeg,image/png,image/webp" aria-label="Chọn ảnh của bạn" onChange={event => { void upload(Array.from(event.target.files ?? []), 0, options.count); event.target.value = ''; }} />
          </label>
          <div className={styles.thumbnails} aria-label="Chọn ô ảnh để chỉnh sửa">
            {photos.slice(0, options.count).map((photo, index) => <button key={index} aria-label={`Chỉnh ảnh ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
              {/* Local blob URLs need no server-side image optimization. */}
              {photo.image ? <img src={photo.image.src} alt="" /> : <ImagePlus size={20} />}
              <span>Ảnh {index + 1}</span>
            </button>)}
          </div>
          <span className={styles.filename}>Ảnh {selected + 1}: {activePhoto.name}</span>
          <label className={styles.replace}>Thay riêng ảnh {selected + 1}<input type="file" disabled={loading} accept="image/jpeg,image/png,image/webp" aria-label={`Thay riêng ảnh ${selected + 1}`} onChange={event => { void upload(Array.from(event.target.files ?? []), selected, 1); event.target.value = ''; }} /></label>
          <fieldset className={styles.adjust} disabled={loading}><legend>Căn chỉnh ảnh {selected + 1}</legend>
            {([{ key: 'zoom', label: 'Phóng to', min: 1, max: 3, step: .01 }, { key: 'x', label: 'Trái / phải', min: 0, max: 100, step: 1 }, { key: 'y', label: 'Trên / dưới', min: 0, max: 100, step: 1 }] as const).map(item => <label key={item.key}>{item.label}<input type="range" min={item.min} max={item.max} step={item.step} value={activePhoto[item.key]} onChange={e => updateCrop({ [item.key]: Number(e.target.value) })} /></label>)}
            <button className={styles.reset} onClick={() => updateCrop(centered)}><RotateCcw size={14} /> Đặt lại vị trí ảnh {selected + 1}</button>
          </fieldset>
          <div className={styles.fields}>
            {wedding ? <>
              <label>Tên cặp đôi<input maxLength={60} value={options.names} placeholder="Minh & Ngọc" onChange={e => setOptions({ ...options, names: e.target.value })} /></label>
              <label>Ngày cưới<input type="date" value={options.date} onInput={e => setOptions({ ...options, date: e.currentTarget.value })} /></label>
            </> : null}
            {withCalendar && <label>Năm trên lịch<select value={options.year} onChange={e => setOptions({ ...options, year: Number(e.target.value) })}>{Array.from({ length: 201 }, (_, i) => 1900 + i).map(year => <option key={year}>{year}</option>)}</select></label>}
            <label>Lời chúc<input maxLength={65} value={options.caption} onChange={e => setOptions({ ...options, caption: e.target.value })} /></label>
          </div>
          <button className={styles.download} disabled={loading || !ready || exporting} onClick={download}><Download size={18} />{exporting ? 'Đang xuất ảnh…' : withCalendar ? 'Tải lịch PNG' : 'Tải poster PNG'}</button>
          {downloadFile && <a className={styles.savedFile} href={downloadFile.url} download={downloadFile.name}>Lưu PNG vừa tạo nếu tải tự động chưa bắt đầu</a>}
          <p className={styles.note}>3820 × 5400 px · Khổ in 300 × 424 mm · {withCalendar ? 'Lịch dương' : 'Poster cưới'}<br />Các ô chưa thay dùng ảnh mẫu. Ảnh chỉ xử lý trên thiết bị của bạn. Tải lại trang sẽ đặt lại bản chỉnh sửa.</p>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </div>
      </section>
      <section className={styles.preview} aria-label="Xem trước thiết kế">
        <div className={styles.previewHeading}><span>BẢN XEM TRƯỚC</span><span>{wedding ? `${conceptLabels[options.concept].toUpperCase()}${withCalendar ? ' · LỊCH' : ''}` : 'HOA ĐÀO · 12 THÁNG'} · {options.count} ẢNH</span></div>
        <div className={styles.scroll}><canvas ref={canvas} role="img" aria-label={`${wedding ? `${conceptLabels[options.concept]} — ${options.names}${withCalendar ? ` — Lịch ${options.year}` : ''}` : `Lịch năm ${options.year}`}, ${options.count} ảnh, ${options.caption}`} /></div>
        <p>Chọn từng ô ảnh để căn chỉnh khung hình.</p>
      </section>
    </div>
  </main>;
}
