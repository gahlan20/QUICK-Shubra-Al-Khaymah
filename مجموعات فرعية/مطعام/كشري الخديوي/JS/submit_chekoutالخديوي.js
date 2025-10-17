document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form_contact");
    const addressInput = document.getElementById("Address");
    const areaSelect = document.getElementById("Area");
    const subtotalPriceElement = document.querySelector(".subtotal_chekout");
    const servicePriceElement = document.querySelector(".service_price");
    const finalTotalPriceElement = document.querySelector(".total_chekout");

    // الحقول المخفية
    const serviceChargeInput = document.getElementById("service_charge_input");
    const productsInput = document.getElementById("products_input");
    const totalPriceInput = document.getElementById("total_price_input");

    function getDeliveryFee() {
        const selectedOption = areaSelect.options[areaSelect.selectedIndex];
        return selectedOption ? parseFloat(selectedOption.dataset.fee || 0) : 0;
    }

    function updateFinalPrice() {
        const subtotalText = subtotalPriceElement.textContent.replace('LE:', '').replace('$', '').trim();
        const subtotal = parseFloat(subtotalText) || 0;

        const deliveryFee = getDeliveryFee();
        servicePriceElement.textContent = `LE:${deliveryFee.toFixed(2)}`;

        const finalTotal = subtotal + deliveryFee;
        finalTotalPriceElement.textContent = `LE:${finalTotal.toFixed(2)}`;

        if (serviceChargeInput) serviceChargeInput.value = deliveryFee.toFixed(2);
        if (totalPriceInput) totalPriceInput.value = finalTotal.toFixed(2);
    }

    // تحديث عند تغيير المنطقة
    areaSelect.addEventListener('change', updateFinalPrice);
    updateFinalPrice();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const productsData = JSON.stringify(cartItems);

        productsInput.value = productsData;
        serviceChargeInput.value = getDeliveryFee();
        totalPriceInput.value = (
            parseFloat(subtotalPriceElement.textContent.replace('LE:', '').replace('$', '')) + getDeliveryFee()
        ).toFixed(2);

        // === الخديوي (إضافة غير مدمرة): تمرير الفرع المختار إلى الطلب ===
try {
  const _kh_branch = JSON.parse(localStorage.getItem('khdewy_branch') || 'null');
  const branchName = _kh_branch && (_kh_branch.name || _kh_branch.id) ? (_kh_branch.name || String(_kh_branch.id)) : '';
  let hiddenBranch = form.querySelector('input[name="Branch"]');
  if (!hiddenBranch) {
    hiddenBranch = document.createElement('input');
    hiddenBranch.type = 'hidden';
    hiddenBranch.name = 'Branch';
    form.appendChild(hiddenBranch);
  }
  hiddenBranch.value = branchName;
} catch(e) { /* تجاهل أي خطأ بدون كسر السلوك القديم */ }
// === نهاية الإضافة ===


        const formData = new FormData(form);
        formData.append('action', 'addOrder');

        const scriptURL = "https://script.google.com/macros/s/AKfycbw_idfjMpWVvcCFaxWJ4A-XAL_I9aMC83g2SJxsKIxttvbPztjUhdqkDkeSAv-Xd3rg/exec";

        fetch(scriptURL, {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                alert("تم إرسال طلبك بنجاح!   كشري الخديوي ");
                form.reset();
                localStorage.removeItem('cart');
                window.location.href = "index.html";
            } else {
                alert("حدث خطأ في إرسال طلبك. يرجى المحاولة مرة أخرى. رسالة الخطأ: " + data.error);
                console.error('Error from server:', data.error);
            }
        })
        .catch(error => {
            console.error("Error!", error.message);
            alert("حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
        });
    });
});
