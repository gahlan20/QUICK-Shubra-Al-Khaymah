// FileName: /QUICK/QUICK1/JS/search.js
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const suggestionsBox = document.getElementById("search_suggestions");

  let allSearchableData = []; // سيحتوي على جميع البيانات القابلة للبحث

  // تحميل البيانات من ملف JSON الرئيسي
  fetch("products.json") // تأكد أن هذا هو المسار الصحيح لملف JSON الخاص بك
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      allSearchableData = data;

      // ✅ هنا مكان إضافة أي ملفات JSON فرعية جديدة 👇
      // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

      // 1️⃣ تحميل بيانات اسكندر
      return fetch("مجموعات فرعية/عطارين/اسكندر/productsاسكندر.json");

      // 🆕 لو هتضيف ملفات تانية زي مطعم الخديوي
      // انسخ السطر اللي فوق وعدل المسار فقط
      // مثال:
      // return fetch("مجموعات فرعية/مطعام/كشري الخديوي/productsالخديوي.json");
      // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((eskandarData) => {
      allSearchableData = allSearchableData.concat(eskandarData);

      // 🆕 تحميل بيانات مطعم كشري الخديوي
      return fetch("مجموعات فرعية/مطعام/كشري الخديوي/productsالخديوي.json");
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((khdewyData) => {
      allSearchableData = allSearchableData.concat(khdewyData);
    })
    .catch((error) => {
      console.error("Error loading search data:", error);
      suggestionsBox.innerHTML = `<div>حدث خطأ في تحميل بيانات البحث.</div>`;
    });

  // البحث Live
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    suggestionsBox.innerHTML = ""; // تفريغ الاقتراحات السابقة

    if (query.length === 0) {
      suggestionsBox.classList.remove("active");
      return;
    }

    // فلترة النتائج
    const results = allSearchableData.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.store && item.store.toLowerCase().includes(query))
    );

    if (results.length === 0) {
      const noResultsDiv = document.createElement("div");
      noResultsDiv.textContent = `لا توجد نتائج لـ "${this.value}"`;
      suggestionsBox.appendChild(noResultsDiv);
    } else {
      results.forEach((item) => {
        const div = document.createElement("div");
        let displayText = item.name;
        if (item.category) {
          displayText += ` (${item.category})`;
        }
        if (item.store) {
          displayText += ` - ${item.store}`;
        }
        div.textContent = displayText;

        div.addEventListener("click", () => {
          searchInput.value = item.name;
          suggestionsBox.classList.remove("active");
          if (item.link) {
            window.location.href = item.link;
          } else {
            const productEl = document.getElementById(`product-${item.id}`);
            if (productEl) {
              productEl.scrollIntoView({ behavior: "smooth", block: "start" });
              setTimeout(() => {
                window.scrollBy({ top: -70, behavior: "smooth" });
              }, 400);
              productEl.classList.add("highlight");
              setTimeout(() => productEl.classList.remove("highlight"), 2000);
            }
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
