/* Independent PS4Debug launcher. Does not invoke or alter the GoldHEN chain. */
(function () {
  "use strict";
  var button = document.getElementById("ps4debug-btn");
  var status = document.getElementById("ps4debug-status");
  if (!button || !status) return;

  var payloadUrl = "https://raw.githubusercontent.com/GoldHEN/ps4debug/main/ps4debug.bin";
  function report(message, state) {
    status.textContent = message;
    status.className = "debug-status" + (state ? " " + state : "");
  }

  button.addEventListener("click", async function () {
    if (button.disabled) return;
    button.disabled = true;
    report("PS4Debug: جاري التحقق من تفعيل الجيلبريك…", "running");
    try {
      if (typeof fn === "undefined" || !fn.setuid || typeof fn.setuid.invoke !== "function") {
        throw new Error("فعّل GoldHEN أولًا من الزر الرئيسي، ثم جرّب PS4 DEBUG.");
      }
      if (fn.setuid.invoke(0) === -1) {
        throw new Error("الجيلبريك غير مفعّل. اضغط ACTIVATE HEN أولًا.");
      }
      if (typeof load_bin !== "function") {
        throw new Error("مُحمّل الـ Payload غير جاهز؛ أعد تفعيل GoldHEN ثم جرّب مرة أخرى.");
      }
      report("PS4Debug: جاري تحميل الـ Payload الرسمي…", "running");
      var response = await fetch(payloadUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("تعذر تنزيل ps4debug.bin (HTTP " + response.status + "). تأكد من اتصال الإنترنت.");
      var buffer = await response.arrayBuffer();
      if (!buffer || buffer.byteLength < 8) throw new Error("ملف PS4Debug المستلم فارغ أو غير صالح.");
      load_bin(new Uint8Array(buffer));
      report("PS4Debug: تم إرسال الـ Payload للتشغيل. جرّب الاتصال من أداة Debug الخاصة بك.", "ok");
    } catch (error) {
      report("PS4Debug: " + (error && error.message ? error.message : String(error)), "err");
    } finally {
      button.disabled = false;
    }
  });
})();
