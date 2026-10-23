/* eslint-disable */
/**
 * Codemod - Menú circular (reemplaza al dock de abajo)
 *
 * Uso (desde la carpeta del proyecto, al lado de package.json):
 *   node aplicar-menu.cjs
 *
 * Qué hace:
 *   1. Crea app/components/ui/circle-menu.tsx (el menú circular). Si ya tenías una
 *      versión anterior (abanico en semicírculo), la actualiza a círculo completo.
 *   2. En app/page.tsx saca el dock viejo (MinimalistDock) y pone el nuevo,
 *      con los mismos accesos + WhatsApp de Santiago y de Victoria.
 *
 * Todo o nada, idempotente y respeta los saltos de línea (CRLF de Windows).
 * Para deshacer:  git checkout app/page.tsx  y  borrar app/components/ui/circle-menu.tsx
 */
const fs = require("fs");

const PAGE = "app/page.tsx";
const COMPONENT = "app/components/ui/circle-menu.tsx";

const COMPONENT_B64 = [
  "InVzZSBjbGllbnQiOwoKaW1wb3J0IHsKICBBbmltYXRlUHJlc2VuY2UsCiAgbW90aW9uLAogIHVzZUFuaW1hdGlvbkNvbnRyb2xz",
  "LAogIHVzZVJlZHVjZWRNb3Rpb24sCn0gZnJvbSAiZnJhbWVyLW1vdGlvbiI7CmltcG9ydCBSZWFjdCBmcm9tICJyZWFjdCI7Cmlt",
  "cG9ydCB7IE1lbnUsIFggfSBmcm9tICJsdWNpZGUtcmVhY3QiOwoKLyoqCiAqIE1lbsO6IGNpcmN1bGFyIChhZGFwdGFkbyBkZSAi",
  "Y2lyY2xlLW1lbnUiKS4KICogLSBFbCBib3TDs24gcXVlZGEgZmlqbyBlbiBwYW50YWxsYSwgYWJham8gYWwgY2VudHJvIHBlcm8g",
  "ZWxldmFkbzsgYWwgYWJyaXJsbywKICogICBsb3MgYWNjZXNvcyBzZSByZXBhcnRlbiBlbiB1biBjw61yY3VsbyBjb21wbGV0byBh",
  "bHJlZGVkb3IgZGVsIGJvdMOzbi4KICogLSBDYWRhIGFjY2VzbyBlcyB1biA8YnV0dG9uPiBjb24gc3UgYWNjacOzbiAoc2luIGVu",
  "bGFjZXMgdmFjw61vcykuCiAqIC0gVGVjbGFkbzogVGFiIHBhcmEgcmVjb3JyZXIsIEVzY2FwZSBwYXJhIGNlcnJhci4gQ2xpYyBh",
  "ZnVlcmEgdGFtYmnDqW4gY2llcnJhLgogKiAtIFJlc3BldGEgInJlZHVjaXIgbW92aW1pZW50byI6IHNpbiByZXNvcnRlcyBuaSBl",
  "ZmVjdG9zIGRlIGNpZXJyZS4KICovCgpjb25zdCBJVEVNX1NJWkUgPSA0ODsKY29uc3QgUkFESVVTID0gMTEyOyAvLyBkaXN0YW5j",
  "aWEgZGVsIGJvdMOzbiBhIGNhZGEgYWNjZXNvCmNvbnN0IExBQkVMX1JPT00gPSAyNDsgLy8gZXNwYWNpbyBleHRyYSBwYXJhIGVs",
  "IHRleHRvIGRlIGxvcyBhY2Nlc29zIGRlIGFiYWpvCi8vIExhZG8gZGVsIGN1YWRyYWRvIHF1ZSBvY3VwYSBlbCBtZW7Dui4gRWwg",
  "Ym90w7NuIHF1ZWRhIGp1c3RvIGVuIGVsIGNlbnRybywgcG9yCi8vIGVzbyBzZSB2ZSAiZWxldmFkbyI6IGFiYWpvIHRpZW5lIHF1",
  "ZSBoYWJlciBsdWdhciBwYXJhIGVsIGPDrXJjdWxvIGNvbXBsZXRvLgpjb25zdCBTSVpFID0gMiAqIChSQURJVVMgKyBJVEVNX1NJ",
  "WkUgLyAyICsgTEFCRUxfUk9PTSk7CmNvbnN0IE9QRU5fU1RBR0dFUiA9IDAuMDI1Owpjb25zdCBDTE9TRV9TVEFHR0VSID0gMC4w",
  "NTsKY29uc3QgVFJJR0dFUl9CRyA9ICIjZjRmNGY1IjsgLy8gemluYy0xMDAKY29uc3QgVFJJR0dFUl9SR0IgPSBbMjQ0LCAyNDQs",
  "IDI0NV0gYXMgY29uc3Q7IC8vIGVsIG1pc21vIGNvbG9yLCBlbiBuw7ptZXJvcwoKLyoqIE1lemNsYSBlbCBjb2xvciBkZWwgYm90",
  "w7NuIGNvbiBuZWdybyAocGN0ID0gJSBkZWwgY29sb3IgZGVsIGJvdMOzbikuICovCmNvbnN0IG1peFdpdGhCbGFjayA9IChwY3Q6",
  "IG51bWJlcikgPT4gewogIGNvbnN0IFtyLCBnLCBiXSA9IFRSSUdHRVJfUkdCLm1hcCgoYykgPT4gTWF0aC5yb3VuZCgoYyAqIHBj",
  "dCkgLyAxMDApKTsKICByZXR1cm4gInJnYigiICsgciArICIsICIgKyBnICsgIiwgIiArIGIgKyAiKSI7Cn07Cgpjb25zdCBjbiA9",
  "ICguLi5jbGFzc2VzOiBBcnJheTxzdHJpbmcgfCBmYWxzZSB8IG51bGwgfCB1bmRlZmluZWQ+KSA9PgogIGNsYXNzZXMuZmlsdGVy",
  "KEJvb2xlYW4pLmpvaW4oIiAiKTsKCmNvbnN0IGZvY3VzUmluZyA9CiAgIm91dGxpbmUtbm9uZSBmb2N1cy12aXNpYmxlOnJpbmct",
  "MiBmb2N1cy12aXNpYmxlOnJpbmctY3lhbi0zMDAvNzAgZm9jdXMtdmlzaWJsZTpyaW5nLW9mZnNldC0yIGZvY3VzLXZpc2libGU6",
  "cmluZy1vZmZzZXQtYmxhY2siOwoKZXhwb3J0IHR5cGUgQ2lyY2xlTWVudUl0ZW0gPSB7CiAgaWQ6IHN0cmluZzsKICAvKiogVGV4",
  "dG8gY29ydG8gcXVlIHNlIHZlIGRlYmFqbyBkZWwgw61jb25vLiAqLwogIGxhYmVsOiBzdHJpbmc7CiAgLyoqIFRleHRvIHBhcmEg",
  "bGVjdG9yZXMgZGUgcGFudGFsbGEgKHNpIGZhbHRhLCBzZSB1c2EgbGFiZWwpLiAqLwogIGFyaWFMYWJlbD86IHN0cmluZzsKICBp",
  "Y29uOiBSZWFjdC5SZWFjdE5vZGU7CiAgb25DbGljazogKCkgPT4gdm9pZDsKICAvKiogQ2xhc2VzIGV4dHJhIHBhcmEgZWwgYm90",
  "w7NuIChwb3IgZWplbXBsbywgdW4gY29sb3IgZGUgw61jb25vKS4gKi8KICBjbGFzc05hbWU/OiBzdHJpbmc7Cn07CgovKiogUHVu",
  "dG8gZGVsIGPDrXJjdWxvIChyZWxhdGl2byBhbCBjZW50cm8gZGVsIGJvdMOzbikuIEVsIHByaW1lcm8gcXVlZGEgYXJyaWJhIHkg",
  "c2lndWUgZW4gc2VudGlkbyBob3JhcmlvLiAqLwpjb25zdCBwb2ludE9uQ2lyY2xlID0gKGluZGV4OiBudW1iZXIsIHRvdGFsOiBu",
  "dW1iZXIpID0+IHsKICBjb25zdCByYWQgPSAoMiAqIE1hdGguUEkgKiBpbmRleCkgLyB0b3RhbCAtIE1hdGguUEkgLyAyOwogIHJl",
  "dHVybiB7IHg6IE1hdGguY29zKHJhZCkgKiBSQURJVVMsIHk6IE1hdGguc2luKHJhZCkgKiBSQURJVVMgfTsKfTsKCnR5cGUgTWVu",
  "dUl0ZW1Qcm9wcyA9IHsKICBpdGVtOiBDaXJjbGVNZW51SXRlbTsKICBpbmRleDogbnVtYmVyOwogIHRvdGFsOiBudW1iZXI7CiAg",
  "aXNPcGVuOiBib29sZWFuOwogIHJlZHVjZTogYm9vbGVhbjsKICBvblNlbGVjdDogKGl0ZW06IENpcmNsZU1lbnVJdGVtKSA9PiB2",
  "b2lkOwp9OwoKY29uc3QgTWVudUl0ZW0gPSAoeyBpdGVtLCBpbmRleCwgdG90YWwsIGlzT3BlbiwgcmVkdWNlLCBvblNlbGVjdCB9",
  "OiBNZW51SXRlbVByb3BzKSA9PiB7CiAgY29uc3QgeyB4LCB5IH0gPSBwb2ludE9uQ2lyY2xlKGluZGV4LCB0b3RhbCk7CiAgY29u",
  "c3QgZGVsYXkgPSBpc09wZW4gPyBpbmRleCAqIE9QRU5fU1RBR0dFUiA6IGluZGV4ICogQ0xPU0VfU1RBR0dFUjsKCiAgcmV0dXJu",
  "ICgKICAgIDxtb3Rpb24uYnV0dG9uCiAgICAgIHR5cGU9ImJ1dHRvbiIKICAgICAgYXJpYS1sYWJlbD17aXRlbS5hcmlhTGFiZWwg",
  "Pz8gaXRlbS5sYWJlbH0KICAgICAgaW5pdGlhbD17ZmFsc2V9CiAgICAgIGFuaW1hdGU9e3sKICAgICAgICB4OiBpc09wZW4gPyB4",
  "IDogMCwKICAgICAgICB5OiBpc09wZW4gPyB5IDogMCwKICAgICAgICBvcGFjaXR5OiBpc09wZW4gPyAxIDogMCwKICAgICAgICBz",
  "Y2FsZTogaXNPcGVuID8gMSA6IDAuNiwKICAgICAgfX0KICAgICAgd2hpbGVIb3Zlcj17cmVkdWNlID8gdW5kZWZpbmVkIDogeyBz",
  "Y2FsZTogMS4xLCB0cmFuc2l0aW9uOiB7IGR1cmF0aW9uOiAwLjEsIGRlbGF5OiAwIH0gfX0KICAgICAgdHJhbnNpdGlvbj17CiAg",
  "ICAgICAgcmVkdWNlCiAgICAgICAgICA/IHsgZHVyYXRpb246IDAgfQogICAgICAgICAgOiB7IGRlbGF5LCB0eXBlOiAic3ByaW5n",
  "Iiwgc3RpZmZuZXNzOiAzMDAsIGRhbXBpbmc6IDMwIH0KICAgICAgfQogICAgICBzdHlsZT17ewogICAgICAgIGhlaWdodDogSVRF",
  "TV9TSVpFLAogICAgICAgIHdpZHRoOiBJVEVNX1NJWkUsCiAgICAgICAgbWFyZ2luTGVmdDogLUlURU1fU0laRSAvIDIsCiAgICAg",
  "ICAgbWFyZ2luVG9wOiAtSVRFTV9TSVpFIC8gMiwKICAgICAgICBwb2ludGVyRXZlbnRzOiBpc09wZW4gPyAiYXV0byIgOiAibm9u",
  "ZSIsCiAgICAgIH19CiAgICAgIGNsYXNzTmFtZT17Y24oCiAgICAgICAgImFic29sdXRlIGxlZnQtMS8yIHRvcC0xLzIgZmxleCBj",
  "dXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItd2hpdGUv",
  "MTUgYmctemluYy05MDAvODUgdGV4dC16aW5jLTEwMCBzaGFkb3ctbGcgYmFja2Ryb3AtYmx1ci1tZCB0cmFuc2l0aW9uLWNvbG9y",
  "cyBob3ZlcjpiZy16aW5jLTgwMCIsCiAgICAgICAgZm9jdXNSaW5nLAogICAgICAgIGl0ZW0uY2xhc3NOYW1lLAogICAgICApfQog",
  "ICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdChpdGVtKX0KICAgID4KICAgICAge2l0ZW0uaWNvbn0KICAgICAgPG1vdGlvbi5z",
  "cGFuCiAgICAgICAgYXJpYS1oaWRkZW49InRydWUiCiAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiBpc09wZW4gPyAxIDogMCB9",
  "fQogICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IHJlZHVjZSA/IDAgOiAwLjIsIGRlbGF5OiByZWR1Y2UgfHwgIWlzT3Bl",
  "biA/IDAgOiAwLjE1IH19CiAgICAgICAgY2xhc3NOYW1lPSJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIGxlZnQtMS8yIHRv",
  "cC1mdWxsIG10LTEgLXRyYW5zbGF0ZS14LTEvMiB3aGl0ZXNwYWNlLW5vd3JhcCB0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSB0ZXh0",
  "LXppbmMtMTAwIFt0ZXh0LXNoYWRvdzowXzFweF84cHhfcmdiKDAsMCwwKV0iCiAgICAgID4KICAgICAgICB7aXRlbS5sYWJlbH0K",
  "ICAgICAgPC9tb3Rpb24uc3Bhbj4KICAgIDwvbW90aW9uLmJ1dHRvbj4KICApOwp9OwoKZXhwb3J0IGNvbnN0IENpcmNsZU1lbnU6",
  "IFJlYWN0LkZDPHsKICBpdGVtczogQ2lyY2xlTWVudUl0ZW1bXTsKICBjbGFzc05hbWU/OiBzdHJpbmc7CiAgYXJpYUxhYmVsPzog",
  "c3RyaW5nOwp9PiA9ICh7IGl0ZW1zLCBjbGFzc05hbWUsIGFyaWFMYWJlbCA9ICJOYXZlZ2FjacOzbiBwcmluY2lwYWwiIH0pID0+",
  "IHsKICBjb25zdCByZWR1Y2UgPSBCb29sZWFuKHVzZVJlZHVjZWRNb3Rpb24oKSk7CiAgY29uc3QgW2lzT3Blbiwgc2V0SXNPcGVu",
  "XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTsKICBjb25zdCBuYXZSZWYgPSBSZWFjdC51c2VSZWY8SFRNTEVsZW1lbnQ+KG51bGwp",
  "OwogIGNvbnN0IHRyaWdnZXJSZWYgPSBSZWFjdC51c2VSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+KG51bGwpOwogIGNvbnN0IHdhc09w",
  "ZW4gPSBSZWFjdC51c2VSZWYoZmFsc2UpOwoKICBjb25zdCB0cmlnZ2VyRnggPSB1c2VBbmltYXRpb25Db250cm9scygpOwogIGNv",
  "bnN0IHNoYWtlRnggPSB1c2VBbmltYXRpb25Db250cm9scygpOwogIGNvbnN0IHJpbmdGeCA9IHVzZUFuaW1hdGlvbkNvbnRyb2xz",
  "KCk7CiAgY29uc3QgdG90YWwgPSBpdGVtcy5sZW5ndGg7CgogIC8vIENsaWMgYWZ1ZXJhIG8gRXNjYXBlIGNpZXJyYW4gZWwgbWVu",
  "w7ouCiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHsKICAgIGlmICghaXNPcGVuKSByZXR1cm47CiAgICBjb25zdCBvblBvaW50ZXJE",
  "b3duID0gKGV2ZW50OiBQb2ludGVyRXZlbnQpID0+IHsKICAgICAgaWYgKCFuYXZSZWYuY3VycmVudD8uY29udGFpbnMoZXZlbnQu",
  "dGFyZ2V0IGFzIE5vZGUpKSBzZXRJc09wZW4oZmFsc2UpOwogICAgfTsKICAgIGNvbnN0IG9uS2V5RG93biA9IChldmVudDogS2V5",
  "Ym9hcmRFdmVudCkgPT4gewogICAgICBpZiAoZXZlbnQua2V5ICE9PSAiRXNjYXBlIikgcmV0dXJuOwogICAgICBzZXRJc09wZW4o",
  "ZmFsc2UpOwogICAgICB0cmlnZ2VyUmVmLmN1cnJlbnQ/LmZvY3VzKCk7CiAgICB9OwogICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0",
  "ZW5lcigicG9pbnRlcmRvd24iLCBvblBvaW50ZXJEb3duKTsKICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoImtleWRvd24i",
  "LCBvbktleURvd24pOwogICAgcmV0dXJuICgpID0+IHsKICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigicG9pbnRl",
  "cmRvd24iLCBvblBvaW50ZXJEb3duKTsKICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigia2V5ZG93biIsIG9uS2V5",
  "RG93bik7CiAgICB9OwogIH0sIFtpc09wZW5dKTsKCiAgLy8gRWZlY3RvIGRlIGNpZXJyZTogZWwgYm90w7NuICJ0aWVtYmxhIiB5",
  "IGNyZWNlIHVuIHBvY28gbWllbnRyYXMgbG9zIGFjY2Vzb3MKICAvLyB2dWVsdmVuIGFsIGNlbnRyby4gU2Ugb21pdGUgc2kgbGEg",
  "cGVyc29uYSBwaWRpw7MgcmVkdWNpciBlbCBtb3ZpbWllbnRvLgogIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7CiAgICBpZiAoaXNP",
  "cGVuKSB7CiAgICAgIHdhc09wZW4uY3VycmVudCA9IHRydWU7CiAgICAgIC8vIFNpIHNlIHJlYWJyacOzIGEgbWl0YWQgZGVsIGVm",
  "ZWN0bywgc2UgZGVqYSBlbCBib3TDs24gY29tbyBlc3RhYmEuCiAgICAgIHNoYWtlRnguc3RvcCgpOwogICAgICBzaGFrZUZ4LnNl",
  "dCh7IHg6IDAgfSk7CiAgICAgIHRyaWdnZXJGeC5zZXQoeyBoZWlnaHQ6IElURU1fU0laRSwgd2lkdGg6IElURU1fU0laRSwgYmFj",
  "a2dyb3VuZENvbG9yOiBUUklHR0VSX0JHIH0pOwogICAgICByZXR1cm47CiAgICB9CiAgICBpZiAoIXdhc09wZW4uY3VycmVudCkg",
  "cmV0dXJuOwogICAgd2FzT3Blbi5jdXJyZW50ID0gZmFsc2U7CiAgICBpZiAocmVkdWNlKSByZXR1cm47CgogICAgbGV0IGNhbmNl",
  "bGxlZCA9IGZhbHNlOwogICAgY29uc3QgcnVuID0gYXN5bmMgKCkgPT4gewogICAgICBzaGFrZUZ4LnN0YXJ0KHsKICAgICAgICB4",
  "OiBbMCwgMiwgLTIsIDAsIDIsIC0yLCAwXSwKICAgICAgICB0cmFuc2l0aW9uOiB7CiAgICAgICAgICBkdXJhdGlvbjogQ0xPU0Vf",
  "U1RBR0dFUiwKICAgICAgICAgIGVhc2U6ICJsaW5lYXIiLAogICAgICAgICAgcmVwZWF0OiBJbmZpbml0eSwKICAgICAgICAgIHJl",
  "cGVhdFR5cGU6ICJsb29wIiwKICAgICAgICB9LAogICAgICB9KTsKICAgICAgcmluZ0Z4LnN0YXJ0KHsKICAgICAgICByb3RhdGU6",
  "IC0zNjAsCiAgICAgICAgZmlsdGVyOiAiYmx1cigxcHgpIiwKICAgICAgICB0cmFuc2l0aW9uOiB7IGR1cmF0aW9uOiBDTE9TRV9T",
  "VEFHR0VSICogKHRvdGFsICsgMiksIGVhc2U6ICJsaW5lYXIiIH0sCiAgICAgIH0pOwoKICAgICAgY29uc3Qgc3RlcHMgPSBNYXRo",
  "Lm1heCh0b3RhbCAtIDEsIDEpOwogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzOyBpKyspIHsKICAgICAgICBpZiAoY2Fu",
  "Y2VsbGVkKSByZXR1cm47CiAgICAgICAgY29uc3Qgc2l6ZSA9IE1hdGgubWluKElURU1fU0laRSAqICgxICsgaSAqIDAuMTUpLCBJ",
  "VEVNX1NJWkUgKiAxLjUpOwogICAgICAgIGF3YWl0IHRyaWdnZXJGeC5zdGFydCh7CiAgICAgICAgICBoZWlnaHQ6IHNpemUsCiAg",
  "ICAgICAgICB3aWR0aDogc2l6ZSwKICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogbWl4V2l0aEJsYWNrKE1hdGgubWF4KDEwMCAt",
  "IGkgKiAxMCwgNDApKSwKICAgICAgICAgIHRyYW5zaXRpb246IHsgZHVyYXRpb246IENMT1NFX1NUQUdHRVIgLyAyLCBlYXNlOiAi",
  "bGluZWFyIiB9LAogICAgICAgIH0pOwogICAgICAgIGlmIChpICE9PSBzdGVwcyAtIDEpIHsKICAgICAgICAgIGF3YWl0IG5ldyBQ",
  "cm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIENMT1NFX1NUQUdHRVIgKiAxMDAwKSk7CiAgICAgICAgfQog",
  "ICAgICB9CiAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjsKCiAgICAgIHNoYWtlRnguc3RvcCgpOwogICAgICBzaGFrZUZ4LnNl",
  "dCh7IHg6IDAgfSk7CiAgICAgIGF3YWl0IHJpbmdGeC5zdGFydCh7IHJvdGF0ZTogMCwgZmlsdGVyOiAiYmx1cigwcHgpIiwgdHJh",
  "bnNpdGlvbjogeyBkdXJhdGlvbjogMCB9IH0pOwogICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47CiAgICAgIHRyaWdnZXJGeC5z",
  "dGFydCh7CiAgICAgICAgaGVpZ2h0OiBJVEVNX1NJWkUsCiAgICAgICAgd2lkdGg6IElURU1fU0laRSwKICAgICAgICBiYWNrZ3Jv",
  "dW5kQ29sb3I6IFRSSUdHRVJfQkcsCiAgICAgICAgdHJhbnNpdGlvbjogeyBkdXJhdGlvbjogMC4xLCBlYXNlOiAiYmFja0luT3V0",
  "IiB9LAogICAgICB9KTsKICAgIH07CiAgICB2b2lkIHJ1bigpOwoKICAgIHJldHVybiAoKSA9PiB7CiAgICAgIGNhbmNlbGxlZCA9",
  "IHRydWU7CiAgICB9OwogIH0sIFtpc09wZW4sIHJlZHVjZSwgdG90YWwsIHNoYWtlRngsIHRyaWdnZXJGeCwgcmluZ0Z4XSk7Cgog",
  "IGNvbnN0IGhhbmRsZVNlbGVjdCA9IChpdGVtOiBDaXJjbGVNZW51SXRlbSkgPT4gewogICAgc2V0SXNPcGVuKGZhbHNlKTsKICAg",
  "IGl0ZW0ub25DbGljaygpOwogIH07CgogIGNvbnN0IGljb25Nb3Rpb24gPSB7CiAgICBpbml0aWFsOiB7IG9wYWNpdHk6IDAsIGZp",
  "bHRlcjogImJsdXIoMTBweCkiIH0sCiAgICBhbmltYXRlOiB7IG9wYWNpdHk6IDEsIGZpbHRlcjogImJsdXIoMHB4KSIgfSwKICAg",
  "IGV4aXQ6IHsgb3BhY2l0eTogMCwgZmlsdGVyOiAiYmx1cigxMHB4KSIgfSwKICAgIHRyYW5zaXRpb246IHsgZHVyYXRpb246IHJl",
  "ZHVjZSA/IDAgOiAwLjIgfSwKICB9OwoKICByZXR1cm4gKAogICAgPG5hdgogICAgICByZWY9e25hdlJlZn0KICAgICAgYXJpYS1s",
  "YWJlbD17YXJpYUxhYmVsfQogICAgICBzdHlsZT17eyB3aWR0aDogU0laRSwgaGVpZ2h0OiBTSVpFIH19CiAgICAgIC8vIEZpam8g",
  "ZW4gcGFudGFsbGEuIE9qbzogbm8gc3VtYXIgInJlbGF0aXZlIiBhY8OhOiBlbiBlbCBDU1MgZGUgVGFpbHdpbmQKICAgICAgLy8g",
  "Z2FuYSBzb2JyZSAiZml4ZWQiIHkgZWwgbWVuw7ogZGVqYXLDrWEgZGUgcXVlZGFyIGZpam8gZW4gbGEgcGFudGFsbGEuCiAgICAg",
  "IC8vIEVsIGNvbnRlbmVkb3Igbm8gYmxvcXVlYSBjbGljczogc29sbyByZWNpYmVuIGNsaWNzIGVsIGJvdMOzbiB5IGxvcyBhY2Nl",
  "c29zLgogICAgICBjbGFzc05hbWU9e2NuKAogICAgICAgICJwb2ludGVyLWV2ZW50cy1ub25lIGZpeGVkIGJvdHRvbS1bbWF4KDFy",
  "ZW0sZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20pKV0gbGVmdC0xLzIgei01MCAtdHJhbnNsYXRlLXgtMS8yIiwKICAgICAgICBj",
  "bGFzc05hbWUsCiAgICAgICl9CiAgICA+CiAgICAgIDxkaXYKICAgICAgICBpZD0iY2lyY2xlLW1lbnUtaXRlbXMiCiAgICAgICAg",
  "cm9sZT0iZ3JvdXAiCiAgICAgICAgYXJpYS1sYWJlbD0iU2VjY2lvbmVzIGRlbCBzaXRpbyB5IGNvbnRhY3RvIgogICAgICAgIGlu",
  "ZXJ0PXshaXNPcGVufQogICAgICAgIGNsYXNzTmFtZT0icG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBpbnNldC0wIgogICAg",
  "ICA+CiAgICAgICAgPG1vdGlvbi5kaXYgYW5pbWF0ZT17cmluZ0Z4fSBjbGFzc05hbWU9ImFic29sdXRlIGluc2V0LTAiPgogICAg",
  "ICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+ICgKICAgICAgICAgICAgPE1lbnVJdGVtCiAgICAgICAgICAgICAga2V5",
  "PXtpdGVtLmlkfQogICAgICAgICAgICAgIGl0ZW09e2l0ZW19CiAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fQogICAgICAgICAg",
  "ICAgIHRvdGFsPXt0b3RhbH0KICAgICAgICAgICAgICBpc09wZW49e2lzT3Blbn0KICAgICAgICAgICAgICByZWR1Y2U9e3JlZHVj",
  "ZX0KICAgICAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU2VsZWN0fQogICAgICAgICAgICAvPgogICAgICAgICAgKSl9CiAgICAg",
  "ICAgPC9tb3Rpb24uZGl2PgogICAgICA8L2Rpdj4KCiAgICAgIDxkaXYKICAgICAgICBjbGFzc05hbWU9InBvaW50ZXItZXZlbnRz",
  "LW5vbmUgYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiB6LTEwIGZsZXggLXRyYW5zbGF0ZS14LTEvMiAtdHJhbnNsYXRlLXktMS8y",
  "IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciIKICAgICAgICBzdHlsZT17eyBoZWlnaHQ6IElURU1fU0laRSwgd2lkdGg6IElU",
  "RU1fU0laRSB9fQogICAgICA+CiAgICAgICAgPG1vdGlvbi5kaXYgYW5pbWF0ZT17c2hha2VGeH0gY2xhc3NOYW1lPSJwb2ludGVy",
  "LWV2ZW50cy1hdXRvIj4KICAgICAgICAgIDxtb3Rpb24uYnV0dG9uCiAgICAgICAgICAgIHJlZj17dHJpZ2dlclJlZn0KICAgICAg",
  "ICAgICAgdHlwZT0iYnV0dG9uIgogICAgICAgICAgICBhcmlhLWxhYmVsPXtpc09wZW4gPyAiQ2VycmFyIG1lbsO6IiA6ICJBYnJp",
  "ciBtZW7DuiJ9CiAgICAgICAgICAgIGFyaWEtZXhwYW5kZWQ9e2lzT3Blbn0KICAgICAgICAgICAgYXJpYS1jb250cm9scz0iY2ly",
  "Y2xlLW1lbnUtaXRlbXMiCiAgICAgICAgICAgIGFuaW1hdGU9e3RyaWdnZXJGeH0KICAgICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0",
  "OiBJVEVNX1NJWkUsIHdpZHRoOiBJVEVNX1NJWkUgfX0KICAgICAgICAgICAgY2xhc3NOYW1lPXtjbigKICAgICAgICAgICAgICAi",
  "cmVsYXRpdmUgZmxleCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIGJnLXpp",
  "bmMtMTAwIHRleHQtYmxhY2sgc2hhZG93LVswXzBfMF8xcHhfcmdiYSgyNTUsMjU1LDI1NSwwLjI1KSwwXzhweF8zMHB4X3JnYmEo",
  "MzQsMjExLDIzOCwwLjI1KV0gdHJhbnNpdGlvbi1bZmlsdGVyXSBkdXJhdGlvbi0xMDAgaG92ZXI6YnJpZ2h0bmVzcy0xMTAiLAog",
  "ICAgICAgICAgICAgIGZvY3VzUmluZywKICAgICAgICAgICAgKX0KICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNPcGVu",
  "KChvcGVuKSA9PiAhb3Blbil9CiAgICAgICAgICA+CiAgICAgICAgICAgIDxBbmltYXRlUHJlc2VuY2UgbW9kZT0icG9wTGF5b3V0",
  "IiBpbml0aWFsPXtmYWxzZX0+CiAgICAgICAgICAgICAge2lzT3BlbiA/ICgKICAgICAgICAgICAgICAgIDxtb3Rpb24uc3BhbiBr",
  "ZXk9Im1lbnUtY2xvc2UiIHsuLi5pY29uTW90aW9ufT4KICAgICAgICAgICAgICAgICAgPFggc2l6ZT17MTh9IGFyaWEtaGlkZGVu",
  "PSJ0cnVlIiAvPgogICAgICAgICAgICAgICAgPC9tb3Rpb24uc3Bhbj4KICAgICAgICAgICAgICApIDogKAogICAgICAgICAgICAg",
  "ICAgPG1vdGlvbi5zcGFuIGtleT0ibWVudS1vcGVuIiB7Li4uaWNvbk1vdGlvbn0+CiAgICAgICAgICAgICAgICAgIDxNZW51IHNp",
  "emU9ezE4fSBhcmlhLWhpZGRlbj0idHJ1ZSIgLz4KICAgICAgICAgICAgICAgIDwvbW90aW9uLnNwYW4+CiAgICAgICAgICAgICAg",
  "KX0KICAgICAgICAgICAgPC9BbmltYXRlUHJlc2VuY2U+CiAgICAgICAgICA8L21vdGlvbi5idXR0b24+CiAgICAgICAgPC9tb3Rp",
  "b24uZGl2PgogICAgICA8L2Rpdj4KICAgIDwvbmF2PgogICk7Cn07Cg=="
].join("");

const cuenta = (t, x) => t.split(x).length - 1;
const pageRaw = fs.readFileSync(PAGE, "utf8");
const crlf = pageRaw.includes("\r\n");
let page = pageRaw.replace(/\r\n/g, "\n");
const componente = Buffer.from(COMPONENT_B64, "base64").toString("utf8");

/* ---------- Bloque nuevo que reemplaza al dock ---------- */
const BLOQUE_NUEVO = `/* ============================================================
   MENÚ CIRCULAR (fijo, abajo al centro; reemplaza al dock)
   Los accesos de WhatsApp salen de CONTACTS: si se agrega una persona
   ahí, aparece sola en el menú.
   ============================================================ */

const MENU_ITEMS: CircleMenuItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    ariaLabel: "Ir a Inicio",
    icon: <Home size={18} aria-hidden="true" />,
    onClick: () => goTo("inicio"),
  },
  {
    id: "servicios",
    label: "Servicios",
    ariaLabel: "Ir a Servicios y planes",
    icon: <LayoutGrid size={18} aria-hidden="true" />,
    onClick: () => goTo("servicios"),
  },
  {
    id: "portfolio",
    label: "Portfolio",
    ariaLabel: "Ir al Portfolio",
    icon: <Layers size={18} aria-hidden="true" />,
    onClick: () => goTo("portfolio"),
  },
  {
    id: "quienes-somos",
    label: "Nosotros",
    ariaLabel: "Ir a Quiénes somos",
    icon: <Users size={18} aria-hidden="true" />,
    onClick: () => goTo("quienes-somos"),
  },
  {
    id: "consulta",
    label: "Consulta",
    ariaLabel: "Ir al formulario de consulta",
    icon: <MessageSquare size={18} aria-hidden="true" />,
    onClick: () => goTo("consulta"),
  },
  ...CONTACTS.map(
    (contact): CircleMenuItem => ({
      id: "wa-" + contact.id,
      label: contact.name,
      ariaLabel: "Escribir a " + contact.name + " por WhatsApp",
      icon: <MessageCircle size={18} aria-hidden="true" />,
      className: "text-emerald-300",
      onClick: () => openWhatsApp(contact.id),
    }),
  ),
];

const SiteMenu: React.FC = () => <CircleMenu items={MENU_ITEMS} />;

`;

const INICIO_DOCK = `/* ============================================================
   MINIMALIST DOCK (fijo, abajo al centro)
   ============================================================ */
`;
const FIN_DOCK = `/* ============================================================
   DATOS DE LAS DEMOS Y HELPERS`;

const IMPORT_LINEA = `import { CircleMenu, type CircleMenuItem } from "./components/ui/circle-menu";\n`;

/* ---------------- Verificación previa (todo o nada) ---------------- */
let hayError = false;
const log = (estado, nombre) => console.log("  [ " + estado + " ] " + nombre);
const acciones = [];

console.log("Revisando archivos...\n");

// 1) archivo del componente
// Las versiones anteriores del menú (abanico en semicírculo) se reconocen por
// la constante ARC_START y se reemplazan por la versión de círculo completo.
let escribirComponente = false;
if (!fs.existsSync(COMPONENT)) {
  escribirComponente = true;
  log("pendiente", "crear " + COMPONENT);
} else {
  const actual = fs.readFileSync(COMPONENT, "utf8").replace(/\r\n/g, "\n");
  if (actual === componente) {
    log("ya está  ", "crear " + COMPONENT);
  } else if (actual.includes("ARC_START")) {
    escribirComponente = true;
    log("pendiente", "actualizar el menú: ahora en círculo completo y más arriba");
  } else {
    log("ya existe", COMPONENT + " (es distinto: no lo piso)");
  }
}

// 2) import en page.tsx
if (page.includes(`import { CircleMenu`)) {
  log("ya está  ", "page: import del menú");
} else if (cuenta(page, `} from "lucide-react";\n`) === 1) {
  acciones.push(() => {
    page = page.replace(`} from "lucide-react";\n`, () => `} from "lucide-react";\n` + IMPORT_LINEA);
  });
  log("pendiente", "page: import del menú");
} else {
  hayError = true;
  log("NO ENCONTRÉ", "page: import de lucide-react");
}

// 3) reemplazo del dock viejo por el menú nuevo
if (page.includes("const SiteMenu")) {
  log("ya está  ", "page: dock reemplazado por el menú circular");
} else {
  const a = page.indexOf(INICIO_DOCK);
  const b = page.indexOf(FIN_DOCK);
  const unico = cuenta(page, INICIO_DOCK) === 1 && cuenta(page, FIN_DOCK) === 1;
  const tramo = a >= 0 && b > a ? page.slice(a, b) : "";
  const esElDock =
    tramo.includes("const dockItems") &&
    tramo.includes("const DockItemComponent") &&
    tramo.includes("const MinimalistDock") &&
    !tramo.includes("export default");
  if (unico && esElDock) {
    acciones.push(() => {
      const i = page.indexOf(INICIO_DOCK);
      const j = page.indexOf(FIN_DOCK);
      page = page.slice(0, i) + BLOQUE_NUEVO + page.slice(j);
    });
    log("pendiente", "page: dock reemplazado por el menú circular");
  } else {
    hayError = true;
    log("NO ENCONTRÉ", "page: bloque del dock (¿cambió el archivo?)");
  }
}

// 3b) SiteMenu de la versión anterior pasaba clases de posición; ya no hacen falta
const SITE_VIEJO = `const SiteMenu: React.FC = () => (
  <CircleMenu
    items={MENU_ITEMS}
    className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2"
  />
);
`;
if (page.includes(SITE_VIEJO)) {
  acciones.push(() => {
    page = page.replace(SITE_VIEJO, () => `const SiteMenu: React.FC = () => <CircleMenu items={MENU_ITEMS} />;\n`);
  });
  log("pendiente", "page: simplificar SiteMenu (el menú ya se posiciona solo)");
}

// 4) uso en Page
if (cuenta(page, "<SiteMenu />") >= 1) {
  log("ya está  ", "page: <SiteMenu /> en la página");
} else if (cuenta(page, "<MinimalistDock />") === 1) {
  acciones.push(() => {
    page = page.replace("<MinimalistDock />", () => "<SiteMenu />");
  });
  log("pendiente", "page: <SiteMenu /> en la página");
} else {
  hayError = true;
  log("NO ENCONTRÉ", "page: <MinimalistDock /> en la página");
}

if (hayError) {
  console.log("\nHay cambios que no pude ubicar. No modifiqué nada.");
  process.exit(1);
}
if (!escribirComponente && acciones.length === 0) {
  console.log("\nNo hay nada para hacer: ya estaba aplicado.");
  process.exit(0);
}

/* ---------------- Aplicar y guardar ---------------- */
const eol = (t) => (crlf ? t.replace(/\n/g, "\r\n") : t);
for (const f of acciones) f();
if (escribirComponente) {
  fs.mkdirSync("app/components/ui", { recursive: true });
  fs.writeFileSync(COMPONENT, eol(componente));
}
if (acciones.length > 0) fs.writeFileSync(PAGE, eol(page));

console.log("\nListo. Revisá con: git status   y   git diff app/page.tsx");
console.log("Probalo con: npm run dev  (botón redondo, abajo al centro y elevado).");
