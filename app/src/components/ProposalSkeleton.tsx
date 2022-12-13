export function ProposalSkeleton() {
  return (
    <div>
      <div className="my-4 flex w-full justify-between gap-4">
        <div className="box-container p-2 text-center w-10"></div>
        <div className="box-container flex-1 px-4 py-3">
          <div className="h-full items-stretch gap-6 md:flex">
            <div className="flex-1 animate-pulse">
              <p className="w-3/4 h-4 bg-gray-700 rounded-full mb-3"></p>
              <p className="w-full h-2 bg-gray-700 rounded-full mb-1"></p>
              <p className="w-full h-2 bg-gray-700 rounded-full mb-1"></p>
              <p className="w-full h-2 bg-gray-700 rounded-full mb-1"></p>
            </div>
            <div className="flex-0 h-full w-36 items-center border-l-white border-opacity-30 md:border-l md:px-4 animate-pulse">
              <p className="text-lg  w-10 h-4 bg-gray-700 rounded-full mb-2"></p>
              <p className="text-xs  w-5 h-2 bg-gray-700 rounded-full"></p>
            </div>
          </div>
        </div>
        <div className="box-container min-w-[180px] px-4 py-3">
          <p className="text-lg  w-24 h-3 bg-gray-700 rounded-full mb-2 animate-pulse"></p>
          <p className="text-lg  w-10 h-2 bg-gray-700 rounded-full mb-2 animate-pulse"></p>
        </div>
      </div>
      <div className="my-4 flex w-full justify-between gap-4">
        <div className="box-container p-2 text-center w-10"></div>
        <div className="box-container flex-1 px-4 py-3">
          <div className="h-full items-stretch gap-6 md:flex">
            <div className="flex-1 animate-pulse">
              <p className="w-3/4 h-4 bg-gray-700 rounded-full mb-3"></p>
              <p className="w-full h-2 bg-gray-700 rounded-full mb-1"></p>
              <p className="w-full h-2 bg-gray-700 rounded-full mb-1"></p>
              <p className="w-full h-2 bg-gray-700 rounded-full mb-1"></p>
            </div>
            <div className="flex-0 h-full w-36 items-center border-l-white border-opacity-30 md:border-l md:px-4 animate-pulse">
              <p className="text-lg  w-10 h-4 bg-gray-700 rounded-full mb-2"></p>
              <p className="text-xs  w-5 h-2 bg-gray-700 rounded-full"></p>
            </div>
          </div>
        </div>
        <div className="box-container min-w-[180px] px-4 py-3">
          <p className="text-lg  w-24 h-3 bg-gray-700 rounded-full mb-2 animate-pulse"></p>
          <p className="text-lg  w-10 h-2 bg-gray-700 rounded-full mb-2 animate-pulse"></p>
        </div>
      </div>
    </div>
  );
}
