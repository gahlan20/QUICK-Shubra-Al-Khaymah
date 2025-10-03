document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form_contact");
    const addressInput = document.getElementById("Address");
    const subtotalPriceElement = document.querySelector(".subtotal_chekout");
    const servicePriceElement = document.querySelector(".service_price");
    const finalTotalPriceElement = document.querySelector(".total_chekout");
    
    // تأكد من أن هذه الحقول موجودة في ملف HTML الخاص بك
    const serviceChargeInput = document.getElementById("service_charge_input");
    const productsInput = document.getElementById("products_input");
    const totalPriceInput = document.getElementById("total_price_input");

    function getDeliveryFee(address) {
        if (!address) return 0; // إضافة تحقق للتأكد من وجود العنوان
        if (address.includes("منطي")) {
            return 10;
        } else if (address.includes("بيجام")) {
            return 15;
        } else if (address.includes("ارض الحافي")) {
            return 8;
        } else if (address.includes("ميت")) {
            return 15;
        } else {
            return 0;
        }
    }

    window.updateFinalPrice = function() {
        const subtotalText = subtotalPriceElement.textContent.replace('$', '').trim();
        const subtotal = parseFloat(subtotalText);

        if (isNaN(subtotal)) {
            console.error("Error: Subtotal price is not a valid number.");
            return;
        }
        
        const deliveryFee = getDeliveryFee(addressInput.value);
        servicePriceElement.textContent = `رسوم خدمة: $${deliveryFee.toFixed(2)}`;
        
        const finalTotal = subtotal + deliveryFee;
        finalTotalPriceElement.textContent = `$${finalTotal.toFixed(2)}`;

        if (serviceChargeInput) {
            serviceChargeInput.value = deliveryFee.toFixed(2);
        }
        if (totalPriceInput) {
            totalPriceInput.value = finalTotal.toFixed(2);
        }
    }

    updateFinalPrice();
    addressInput.addEventListener('input', updateFinalPrice);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const productsData = JSON.stringify(cartItems);
        
        productsInput.value = productsData;
        serviceChargeInput.value = getDeliveryFee(addressInput.value);
        totalPriceInput.value = (parseFloat(subtotalPriceElement.textContent.replace('$', '')) + getDeliveryFee(addressInput.value)).toFixed(2);

        const formData = new FormData(form);
        formData.append('action', 'addOrder'); 

        const scriptURL = "https://script.google.com/macros/s/AKfycbxisXu3Oomybzp63wyQK9JK6n-4UWVCp8YnrXoz_j315F2CRuSq-EhrKKCD_Xs2pv3y/exec";
        
        fetch(scriptURL, {
            method: "POST",
            body: formData,
        })
        .then(response => {
            // تحقق من أن الاستجابة صالحة قبل محاولة تحليلها كـ JSON
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                alert("تم إرسال طلبك بنجاح!");
                form.reset();
                localStorage.removeItem('cart');
                window.location.href = "index.html";
            } else {
                // عرض رسالة خطأ أكثر تفصيلاً من الخادم
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


