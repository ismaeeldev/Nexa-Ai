import { SidebarProvider } from "../../components/ui/sidebar";
import DashboardSidebar from "../../modules/dashboard/components/dashSidebar";
import DashboardNavbar from "../../modules/dashboard/components/dashNavbar";

const Layout = (props) => {
    return (
        <SidebarProvider className="relative flex h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">

            <DashboardSidebar />


            {/* Main content */}
            <main className="flex-1 overflow-auto p-6">
                <DashboardNavbar />
                <div>
                    {props.children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default Layout;
