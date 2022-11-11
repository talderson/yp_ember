import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function currentDate(params/*, hash*/) {
    return moment().format(params[0]);
});
