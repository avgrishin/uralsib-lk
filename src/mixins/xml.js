// xml
import XLSX from 'xlsx';
import FileSaver from 'file-saver';

export default {
    methods: {
        convertToXLS() {
            let wb = XLSX.utils.book_new();
            wb.Props = {
                Title: this.xmlTitle,
                Subject: this.xmlSubject,
                Author: 'Uralsib',
                CreatedDate: new Date()
            };
            wb.SheetNames.push(this.sheetName);

            let ws_data = this.getTableData();
            let ws = XLSX.utils.aoa_to_sheet(ws_data);
            wb.Sheets[this.sheetName] = ws;
            let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            const file = this.s2ab(wbout);
            
            if (file && !isAndroidWebview)  {

                FileSaver.saveAs(file, 'uralsib.xlsx');
            }
            else if (file && isAndroidWebview) {
                // this.$nextTick(() => URL.revokeObjectURL(url));
            } else {flash(['Старый браузер'], 'error'); window.log('Старый браузер') }
        },
        s2ab(s) {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;

            try {
                return new Blob([view], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
            } catch (e) {
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

                if (e.name == 'TypeError' && window.BlobBuilder) {
                    const builder = new BlobBuilder();
                    builder.append(view.buffer);
                    return builder.getBlob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8');
                } else if (e.name == 'InvalidStateError') {
                    return new Blob([view.buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                } else {
                    return false;
                }
            }
        },
    }
};