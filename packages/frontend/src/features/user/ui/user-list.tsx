import { PanelView } from "@/layouts/panel/panel-view";
import UserListFilter from "../components/user-list-filter";
import UserListTable from "../components/user-list-table";

export interface UserListProps {}

const UserList = (props: UserListProps) => {
  return (
    <PanelView>
      <UserListFilter />
      <UserListTable />
    </PanelView>
  );
};

export default UserList;
