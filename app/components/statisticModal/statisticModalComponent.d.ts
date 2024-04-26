import { FunctionComponent } from '../baseComponent';
import ILevelModel from '../../models/ILevelModel.ts';
interface IStatisticModalProps {
    level: number;
    difficulty: number;
    data: ILevelModel;
}
declare const statisticModalComponent: FunctionComponent<HTMLElement, IStatisticModalProps>;
export default statisticModalComponent;
