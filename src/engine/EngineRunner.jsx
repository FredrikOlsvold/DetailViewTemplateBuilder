import React from 'react';
import {mockWorkOrder} from "../api/getData";
import {TestSelector} from "../selectors/Selectors";
import {useRecoilValue} from 'recoil';
import {cssAtom} from "../store/Store";

const EngineRunner = () => {

    const jsonTemplate = useRecoilValue(TestSelector);
    const cssStyling = useRecoilValue(cssAtom);

    


    return (
        <>
        <div className="panel">
            <div className="detail-view class">
                <div className="content">
                    {}
                </div>
            </div>
        </div>
        </>
    )
}



export default EngineRunner;