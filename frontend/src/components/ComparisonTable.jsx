function ComparisonTable() {
  const rows = [
    {
      criterion: "Tushuntirish",
      old: "Umumiy va bir xil usul",
      modern: "Talabaga mos individual tushuntirish"
    },
    {
      criterion: "Interaktivlik",
      old: "Past darajada",
      modern: "Yuqori: chat, rasm, test"
    },
    {
      criterion: "Individual yondashuv",
      old: "Deyarli yo'q",
      modern: "Har bir talabaga moslashtirilgan"
    },
    {
      criterion: "Rasm bilan ishlash",
      old: "Mavjud emas",
      modern: "Rasm yuklash va AI tahlil"
    },
    {
      criterion: "Darsdan keyingi yordam",
      old: "Cheklangan",
      modern: "24/7 chatbot yordam"
    },
    {
      criterion: "Test va nazorat",
      old: "Qo'lda va sekin",
      modern: "AI asosida tezkor nazorat"
    }
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Mezoni</th>
              <th className="px-4 py-3 font-semibold">Eski usul</th>
              <th className="px-4 py-3 font-semibold">AI yordamidagi yangi usul</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.criterion} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">{row.criterion}</td>
                <td className="px-4 py-3 text-slate-600">{row.old}</td>
                <td className="px-4 py-3 font-medium text-indigo-700">{row.modern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonTable;
