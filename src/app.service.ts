import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }
  //  : {
  //     await this.cachemanager.set(
  //       'cached_item',
  //       { key: resettoken },
  //       { ttl: 10 },
  //     );
  //     r
}
