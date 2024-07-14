import  Sidebar  from "./components/sidebar";

const Home = () => {
    return (
    <div className='flex'>
        <Sidebar name="Home"></Sidebar>
        <div className=" px-[7vw] w-[85vw] h-fit flex-1 flex-col space-y-8 p-8 absolute right-0 top-0 mt-5">
            <div className="flex items-center justify-between space-y-2">
                <div className="w-full relative">
                    <h2 className="text-3xl font-bold tracking-tight mb-[1vh]">Welcome to Dyne Employee Platform</h2>
                    <p className="text-muted-foreground mb-[2vh]">Please make sure all of your information is correct and proceed to the website. <br/>Reset your password if you haven't done so already. Thanks!</p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Home;

