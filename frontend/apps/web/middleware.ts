import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 許可するIPアドレスのリスト
const ipAllowList = new Set(process.env.IP_ALLOW_LIST?.split(',').map((ip) => ip.trim()));
// 制限対象のFQDNリスト
const accessRestrictionFqdnList = new Set(
  process.env.ACCESS_RESTRICTION_FQDN_LIST?.split(',').map((fqdn) => fqdn.trim()),
);

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // MEMO: IPアドレスが許可リストに含まれているか確認
  if (
    process.env.NODE_ENV === 'production' &&
    request.ip &&
    !ipAllowList.has(request.ip ?? '') &&
    accessRestrictionFqdnList.has(request.nextUrl.host)
  ) {
    // MEMO: 制限対象のFQDN内で、許可リストに含まれていないIPアドレスからのアクセスは401を返す
    return new NextResponse(null, { status: 401 });
  }
}
