const PastProposalsPanel = () => {
    return (
        <div className="box-container mb-4 py-6 px-6">
            <h4 className="mb-4 text-center text-lg">Past Proposals</h4>
            <div className="box-container no-fill mb-2 flex items-center justify-between p-4">
                <dt className="text-lg">ThinkTank</dt>
                <dd className="text-sm font-bold uppercase">Vetoed</dd>
            </div>
            <div className="box-container no-fill mb-2 flex items-center justify-between p-4">
                <dt className="text-lg">Ongoing Spaces Host</dt>
                <dd className="text-sm font-bold uppercase">Passed</dd>
            </div>
        </div>
    );
};

export default PastProposalsPanel;
