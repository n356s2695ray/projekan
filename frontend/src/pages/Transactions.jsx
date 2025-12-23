import React, { useEffect, useState } from "react";
import TransactionTable from "../components/TransactionTable";
import { useFinance } from "../context/FinanceContext";
import { Loader2 } from "lucide-react";


const Transactions = () => {
  const { transactions, addTransaction, removeTransaction, fetchAllData } =
    useFinance();

  // const [setLoading] = useState(true);

  // Fetch data awal saat mount
  useEffect(() => {
    fetchAllData(false); // fetch data sekali saat mount
  }, []); // kosong, jangan taruh fetchAllData
  // Handle tambah transaksi
  const handleAdd = async (data) => {
    await addTransaction(data); // update state di context
  };

  // Handle hapus transaksi
  const handleDelete = async (id) => {
    removeTransaction(id); // update state di context
  };

  return (
    <TransactionTable
      transactions={transactions}
      onDelete={handleDelete}
      onRefresh={fetchAllData} // refresh manual dari context
      onAdd={handleAdd}
    />
  );
};

export default Transactions;
