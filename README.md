# ssoc-manager

> SSOC Manager

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Configure APIs
*   Path: './store.js'

## SWH test User
*   s_thuysanmiennam
*   s_ninhkieu
*   s_nagar
*   s_windsor
*   s_phoenix
*   s_bienvang
*   s_cuulong
*   s_trungtamsannhi_phutho
*   s_ksninhkieu
*   s_thuysanmiennam
*   s_hoangyen
*   s_ksmia
*   s_thienthanh


## SWH User URL
1.   Login Page
*   URL: `host/login`
*   Action: Enter username and password -> submit
    *   Success: Redirect to Overview Page
    *   Fail: Return Login page with Error message

2.  Overview Page
*   URL: `host/swh/tong-quan-he-thong`
*   Action: View page

3.  System status Page
*   URL: `host/swh/trang-thai-he-thong`
*   Action: View page

4.  Summary and Report Page
*   Summary chart Page
    *   URL: `host/swh/thong-ke-bao-cao/xem-bieu-do`
    *   Action: View page
*   System Data Page
    *   URL: `host/swh/thong-ke-bao-cao/du-lieu-he-thong`
    *   Action: 
        *   View page
        *   Select data, date, time -> submit
        *   Export Excel report
*   Report Page
    *   URL: `host/swh/thong-ke-bao-cao/bao-cao`
    *   Action:
        *   Select year, month -> View page -> submit
*   Other params Page
    *   URL: `host/swh/thong-ke-bao-cao/thong-so-khac`
    *   Action: 
        *   Select data, date -> submit
