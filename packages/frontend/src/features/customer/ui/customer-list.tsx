"use client";

import { PanelView } from "@/layouts/panel/panel-view";
import CustomerListFilter from "../components/customer-list-filter";
import CustomerListTable from "../components/customer-list-table";
import useHeader from "@/layouts/panel/use-header";

export interface CustomerListProps {}

const CustomerList = (props: CustomerListProps) => {
  const { setTitle } = useHeader({
    title: "Quản lý khách hàng",
  });
  return (
    <PanelView>
      <CustomerListFilter />
      <CustomerListTable />
    </PanelView>
  );
};

export default CustomerList;
