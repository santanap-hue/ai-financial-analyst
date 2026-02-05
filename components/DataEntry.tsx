
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, INVEST_TYPES } from '../constants';

interface DataEntryProps {
  onAdd: (t: Transaction) => void;
}

const DataEntry: React.FC<DataEntryProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    type: 'income' as TransactionType,
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleSubmit = (type: TransactionType) => {
    if (!formData.amount || !formData.category) {
      alert("Please fill in amount and category");
      return;
    }

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note
    });

    setFormData({
      type: 'income',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });

    alert("Data saved successfully!");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">บันทึกข้อมูลการเงิน</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">กรอกข้อมูลรายรับ รายจ่าย และการลงทุนเพื่อการวิเคราะห์ที่แม่นยำ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
          {/* Income Form */}
          <EntryBox 
            title="รายรับ" 
            subTitle="(Income)" 
            icon="trending_up" 
            color="green" 
            btnText="เพิ่มรายรับ"
            categories={INCOME_CATEGORIES}
            onSave={() => handleSubmit('income')}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Expense Form */}
          <EntryBox 
            title="รายจ่าย" 
            subTitle="(Expenses)" 
            icon="trending_down" 
            color="red" 
            btnText="เพิ่มรายจ่าย"
            categories={EXPENSE_CATEGORIES}
            onSave={() => handleSubmit('expense')}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Investment Form */}
          <EntryBox 
            title="การลงทุน" 
            subTitle="(Invest)" 
            icon="monitoring" 
            color="blue" 
            btnText="บันทึกการลงทุน"
            categories={INVEST_TYPES}
            onSave={() => handleSubmit('invest')}
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div className="sticky bottom-4 z-40 mt-4 flex justify-center w-full">
          <button 
            onClick={() => handleSubmit(formData.type)}
            className="shadow-xl shadow-primary/20 bg-primary hover:bg-[#15c515] text-[#0e1b0e] rounded-full h-16 min-w-[320px] px-8 text-lg font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined">save</span>
            บันทึกทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
};

interface EntryBoxProps {
  title: string;
  subTitle: string;
  icon: string;
  color: string;
  btnText: string;
  categories: string[];
  formData: any;
  setFormData: any;
  onSave: () => void;
}

const EntryBox: React.FC<EntryBoxProps> = ({ title, subTitle, icon, color, btnText, categories, formData, setFormData, onSave }) => {
  const colorStyles: any = {
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-primary/40',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200'
  };

  return (
    <div className="group bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className={`p-2 rounded-lg ${colorStyles[color].split(' ').slice(0, 2).join(' ')}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title} <span className="text-sm font-medium text-gray-400 dark:text-gray-500 ml-1">{subTitle}</span>
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">จำนวนเงิน (Amount)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">฿</span>
            <input 
              className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-8 focus:border-primary focus:ring-primary h-12" 
              placeholder="0.00" 
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">หมวดหมู่ (Category)</label>
          <select 
            className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="" disabled>เลือกหมวดหมู่</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">วันที่ (Date)</label>
          <input 
            className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-12 px-4" 
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">บันทึกช่วยจำ (Note)</label>
          <textarea 
            className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-3 resize-none h-24" 
            placeholder="รายละเอียดเพิ่มเติม..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          ></textarea>
        </div>
      </div>
      
      <button 
        onClick={onSave}
        className={`mt-auto flex items-center justify-center w-full py-3 px-4 rounded-xl border border-dashed text-sm font-semibold hover:opacity-80 transition-opacity gap-2 ${colorStyles[color]}`}
      >
        <span className="material-symbols-outlined text-[20px]">add_circle</span>
        {btnText}
      </button>
    </div>
  );
};

export default DataEntry;
