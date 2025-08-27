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
                <div className="mx-auto max-w-[1200px] w-full bg-gradient-to-t from-gray-800/60 to-transparent backdrop-blur-sm rounded-2xl p-6 shadow-lg ring-1 ring-white/5">
                    {props.children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default Layout;
