import axios from 'axios';
import ResultWrapper from '@/models/resultWrapper';
import MegaMenuItem from '@/models/megaMenuItem';

export default class TestProvider {
  private readonly BASE_URL = 'api/v1/Test';

  async getMegaMenuItems(): Promise<ResultWrapper<MegaMenuItem[]>> {
    let result: ResultWrapper<MegaMenuItem[]> = new ResultWrapper<MegaMenuItem[]>();

    try {
      const { data } = await axios.get(`${this.BASE_URL}/megaMenuItems`);
      result = data;
    } catch (error) {
      console.error('error', error);
    }

    return result;
  }
}
