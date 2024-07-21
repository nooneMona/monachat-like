[![codecov](https://codecov.io/gh/nooneMona/monachat-like/graph/badge.svg?token=nroaATT2RA)](https://codecov.io/gh/nooneMona/monachat-like)

# OSS化によせて for Japanese

使用する前に必ず下記のライセンスの内容をお読みいただき、同意の上でお使いください。

```
The MIT License
Copyright (c) 2024 nooneMona

以下に定める条件に従い、本ソフトウェアおよび関連文書のファイル（以下「ソフトウェア」）の複製を取得するすべての人に対し、ソフトウェアを無制限に扱うことを無償で許可します。これには、ソフトウェアの複製を使用、複写、変更、結合、掲載、頒布、サブライセンス、および/または販売する権利、およびソフトウェアを提供する相手に同じことを許可する権利も無制限に含まれます。

上記の著作権表示および本許諾表示を、ソフトウェアのすべての複製または重要な部分に記載するものとします。

ソフトウェアは「現状のまま」で、明示であるか暗黙であるかを問わず、何らの保証もなく提供されます。ここでいう保証とは、商品性、特定の目的への適合性、および権利非侵害についての保証も含みますが、それに限定されるものではありません。 作者または著作権者は、契約行為、不法行為、またはそれ以外であろうと、ソフトウェアに起因または関連し、あるいはソフトウェアの使用またはその他の扱いによって生じる一切の請求、損害、その他の義務について何らの責任も負わないものとします。
```
https://licenses.opensource.jp/MIT/MIT.html

# for operator

build
```
cd frontend && yarn && yarn build && cd ../backend && yarn
```

start
```
cd backend && yarn start
```

env variables required
```
IHASH_SEED = ${secret value} # to generate trips
```


# for developer

NOTICE: Node20 is not supported.

- Create `backend/.env`.
```backend/.env
FRONTEND_HOST=http://localhost:2108
```

- In `backend/`, run `yarn && yarn start:dev`
- In `frontend/`, run `yarn && yarn dev`
- Open http://localhost:2108/ on your browser.
