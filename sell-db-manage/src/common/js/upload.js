const MAX_SIZE = 1024 * 1024 * 3;

export function upload(event, _self, cb) {
  let input = event.target;
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    let rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    // var tmppath = URL.createObjectURL(input.files[0]);
    reader.onload = function (e) {
      let obj = {};
      obj.img = e.target.result;
      // 去掉image/
      obj.imgType = input.files[0].type.slice(6);
      _self.$http.post('http://localhost:3000/api/upload', JSON.stringify(obj)).then(cb);
    };
    if (input.files[0].size > MAX_SIZE) { alert('You must select 3MB > image file!'); return; }
    if (!rFilter.test(input.files[0].type)) { alert('You must select a valid image file!'); return; }
    reader.readAsDataURL(input.files[0]);
  }
}