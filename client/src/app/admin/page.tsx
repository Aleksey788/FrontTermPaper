import React from "react";
import AdminLayout from "@/components/AdminLayout";

const page = () => {
  return (
    <AdminLayout>
      <h1>Админ-панель</h1>
      <p style={{ color: "var(--color-text-muted)" }}>
        Выберите раздел в меню слева для управления сайтом.
      </p>
    </AdminLayout>
  );
};

export default page;
