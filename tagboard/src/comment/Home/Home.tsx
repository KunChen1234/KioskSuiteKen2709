import useWindowDimensions from '../hooks/windowDimensions';
function Home() {
  const window = useWindowDimensions();
  const body_height = window.height - 100 - 35-100;
  return (
    <div className=' bg-black text-center'>
      <p className='text-white text-section_title h-[100px]'>HomePage</p>
      <div className="row-span-1 bg-black  text-center gap-[2px] pb-4 " style={{ overflowY: 'auto', height: body_height }}>
      </div>
    </div>);
}
export default Home;
