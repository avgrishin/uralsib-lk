// DnD
import Tiff from 'tiff.js';

export default {
    methods: {
        addEvents(dropzones) {
            for (let dropzone in dropzones) {
                dropzones[dropzone].ondrop = (e) => {
                    e.preventDefault();
                    e.target.classList.remove('drag-over');
                    this.uploadIMG(e, dropzone);
                };

                dropzones[dropzone].ondragover = (e) => {
                    e.preventDefault();
                    e.dataTransfer.effectAllowed = 'copyMove';

                    let file = e.dataTransfer.items[0];

                    if (this.allowed_files.includes(file.type) && this.checkFileSize(file)) {
                        e.dataTransfer.dropEffect = 'copy';
                        e.target.classList.add('drag-over');
                    } else {
                        e.dataTransfer.dropEffect = 'none';
                        e.target.classList.add('drag-error');
                        flash(['Тип файла не поддерживается или размер превышает 2мб'], 'error');
                    }
                };

                dropzones[dropzone].ondragleave = (e) => e.target.classList.remove('drag-over', 'drag-error');
            }
        },
        checkFileSize(file) {
            // window.log(file);
            if (file.type == 'image/jpeg' || file.type == "image/tiff") return true
            if (file.size > 2000000) return false;
            return true;
        },
        uploadIMG(event, type, check = true) {

            let file;

            if (event instanceof Blob) file = [event];
            else file = event.target.files || event.dataTransfer.files;

            this[type + '_file'] = file[0];

            if (check && !this.checkFileSize(file[0])) return flash(['Размер файла превышает 2мб'], 'error');

            if (file[0].type == 'image/jpeg' || file[0].type == 'image/png') this.createIMG(file[0], type);
            else if (file[0].type == 'application/pdf') this.createPDF(file[0], type);
            else if (file[0].type == 'image/tiff' || file[0].type == 'image/tif') this.createTIFF(file[0], type);
            else flash(['Тип файла не поддерживается'], 'error');
            // window.log(event)
            // window.log(type)
            // window.log(check)
        },
        createIMG(file, type) {
            this[type] = URL.createObjectURL(file);
            if (this[`${type}_loaded`] === false) this[`${type}_loaded`] = true;
        },
        createPDF(file, type) {
            let url = URL.createObjectURL(file);
            let canvas = document.createElement('canvas');
            canvas.width = 400;
            let canvasContext = canvas.getContext('2d');
            PDFJS.getDocument(url).then((pdf) => {
                pdf.getPage(1).then((page) => {
                    let scale_required = canvas.width / page.getViewport(1).width;
                    let viewport = page.getViewport(scale_required);
                    canvas.height = viewport.height;

                    page.render({ canvasContext, viewport })
                        .then(() => {
                            let blob = this.canvasToBlob(canvas);

                            this[type] = URL.createObjectURL(blob);

                            if (this[`${type}_loaded`] === false) this[`${type}_loaded`] = true;
                        });
                });
            });
        },
        createTIFF(file, type) {
            let reader = new FileReader();

            reader.onload = (event) => {
                let tiff = new Tiff({ buffer: event.target.result });
                let canvas = tiff.toCanvas();

                let blob = this.canvasToBlob(canvas);
                this[type] = URL.createObjectURL(blob);

                if (this[`${type}_loaded`] === false) this[`${type}_loaded`] = true;
            };
            reader.readAsArrayBuffer(file);
        },
        clear(page) {

            if(page == 'avatar') {
                document.getElementById('FR_SCAN_AVATAR').value = '';
                
            } else {
                document.getElementById(page + '_input').value = '';
            }
            
            this[page] = null;
            this[page + '_file'] = null;
        },
        getBackgroundImage(page) {
            if (this[page]) return { 'background-image': `url('${this[page]}')` };
            return {};
        },
        getIMGName(page) {
            if (this[page + '_file']) return _.truncate(this[page + '_file'].name, { length: 15 });
            return '';
        },
        canvasToBlob(canvas) {
            let dataURL = canvas.toDataURL();
            let blobBin = atob(dataURL.split(',')[1]);
            let array = [];

            for (let i = 0; i < blobBin.length; i++) array.push(blobBin.charCodeAt(i));
            return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        }
    }
};
