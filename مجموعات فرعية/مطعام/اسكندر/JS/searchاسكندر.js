document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const suggestionsBox = document.getElementById("search_suggestions");

  let allData = [];

  // تحميل المنتجات من ملف JSON
  fetch("productsاسكندر.json")
    .then((res) => res.json())
    .then((data) => {
      allData = data;
    });

  // البحث Live
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";

    if (query.length === 0) {
      suggestionsBox.classList.remove("active");
      return;
    }

    // فلترة النتائج
    const results = allData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.catetory && item.catetory.toLowerCase().includes(query)) ||
        (item.store && item.store.toLowerCase().includes(query))
    );

    if (results.length === 0) {
      suggestionsBox.innerHTML = `<div>لا توجد نتائج</div>`;
    } else {
      results.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = `${item.name} (${item.catetory || "بدون تصنيف"})`;
        div.addEventListener("click", () => {
          searchInput.value = item.name;
          suggestionsBox.classList.remove("active");

          // نلاقي العنصر في الصفحة
          const productEl = document.getElementById(`product-${item.id}`);
          if (productEl) {
            // scroll مع أوفست عشان الهيدر
            productEl.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => {
              window.scrollBy({ top: -70, behavior: "smooth" });
            }, 400);

            // Highlight للمنتج
            productEl.classList.add("highlight");
            setTimeout(() => productEl.classList.remove("highlight"), 2000);
          }
        });
        suggestionsBox.appendChild(div);
      });
    }

    suggestionsBox.classList.add("active");
  });

  // إخفاء الاقتراحات لما المستخدم يضغط برة
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search_box")) {
      suggestionsBox.classList.remove("active");
    }
  });
});
