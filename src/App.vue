<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    let currentLang = localStorage.getItem('Lang');
    if (currentLang == null) {
      localStorage.setItem('Lang', 'vn')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app p,
#app a,
#app h6,
#app span,
#app label {
  font-size: 12px;
}

#app button,
#app table,
#app select {
  font-size: 13px;
}

@media (min-width: 2501px) and (max-width: 4050px) {
  .left-content {
    display: block;
  }
  #tong-luu-luong, #nhietdo-tb,
  #chi-phi-tiet-kiem, #nang-luong-tiet-kiem {
    height: 400px !important;
  }

  #logo-user img {
    width: 70px !important;
    height: 70px !important;
  }

  #options button {
    font-size: 25px;
  }

  .nhietdo-nuoclanh h5,
  .nhietdo-nuocnong h5{
    padding: 25px 0;
  }

  table thead tr th,
  table tbody tr td{
    font-size: 23px;
  }

  .nav-item p {
    height: 45px !important;
  }

  p, strong, p strong, h6 strong, h6, input, label, button, select, span {
    font-size: 25px !important;
  }
  
  select option {
    font-size: 10px !important;
  }

  #device-status img {
    width: 30%;
  }

  .field-label {
    display: none;
  }

  canvas {
    width: 100%;
    height: 600px !important;
  }

  .status, .overview, .static-report {
    width: 100%;
  }

  .status a img,
  .overview a img,
  .static-report a img {
    width: 20%;
    margin: 0;
  }

  .status a span,
  .overview a span,
  .static-report a span {
    font-size: 20px !important;
  }

  .status .active,
  .overview .active,
  .static-report .active {
    height: 95px !important;
  }

  .custom-control-input {
    width: 20px !important;
    height: 20px !important;
  }

}

@media (min-width: 1400px) and (max-width: 2501px) {
  .left-content {
    display: block;
  }
  .status, .overview, .static-report {
    width: 100%;
  }
  #pie-chart {
    height: 330px !important;
    width: 100% !important;
  }
}

@media (min-width: 1020px) and (max-width: 1400px) {
  #weather .row .col-sm-6 h5 strong {
    font-size: 23px !important;
  }
  .left-content {
    display: block;
  }
  .status, .overview, .static-report {
    width: 100%;
  }

  table thead tr th,
  table tbody tr td{
    font-size: 12px;
  }

  #table-dc tr th,
  #table-dc tr td {
    font-size: 11px !important;
  }

  .col-sm-6 {
    padding: 0 5px !important;
  }

  p, strong, p strong, h6 strong, h6, input, label, button, select, h5 strong, span {
    font-size: 12px !important;
  }

  h5 {
    font-size: 20px !important;
  }

  #logo-user img {
    width: 40px !important;
    height: 40px !important;
  }

  #row_center{
    height: 0 !important;
  }

  #pie-chart {
    height: 300px !important;
  }

  #name p {
    font-size: 10px !important;
  }

  .status a img,
  .overview a img,
  .static-report a img {
    width: 20%;
    margin: 0;
    padding: 0;
  }

  .status a span,
  .overview a span,
  .static-report a span {
    font-size: 10px !important;
  }

  .status .active,
  .overview .active,
  .static-report .active {
    height: 39px !important;
  }

  .status .active img,
  .overview .active img,
  .static-report .active img {
    padding: 0 !important;
  }
}

@media (min-width: 750px) and (max-width: 1020px) {
  #text-project-info {
  padding-left: 10px !important;
  }
  #tong-luu-luong, #nhietdo-tb,
  #chi-phi-tiet-kiem, #nang-luong-tiet-kiem {
    height: 350px !important;
  }

  #logo-user {
    padding: 0 !important;
  }
  .left-content {
    display: none;
  }
  .col-sm-10 {
    width: 100% !important;
  }

  .close {
    font-size: 20px !important;
  }

  p, strong, p strong, h6 strong, h6, input, label, button, select, span {
    font-size: 10px !important;
  }

  h5 {
    font-size: 20px !important;
  }

  #table-dc tr th,
  #table-dc tr td {
    font-size: 10px !important;
  }

  #status-img {
    width: 60% !important;
  }

  #pie-chart {
    height: 350px !important;
  }

  .col-sm-6 {
    padding: 0 5px !important;
  }

  #options {
    margin: 5px 0 !important;
  }

  .status, .overview, .static-report {
    text-align: center;
    width: 100%;
  }

  .status a img,
  .overview a img,
  .static-report a img {
    width: 15% !important;
    margin: 0;
    padding: 0;
  }

  .status a span,
  .overview a span,
  .static-report a span {
    font-size: 10px !important;
  }

  .status .active,
  .overview .active,
  .static-report .active {
    height: 35px !important;
  }

  .status .active img,
  .overview .active img,
  .static-report .active img {
    padding: 0 !important;
  }
  
  table thead tr th,
  table tbody tr td{
    font-size: 12px;
  }

  .b-sidebar {
    width: 250px !important;
  }

}

@media (min-width: 420px) and (max-width: 750px) {
  #text-project-info {
  padding-left: 10px !important;
  }
  #project-info .col-sm-3 {
    text-align: center;
  }
  #project-info-icon {
    width: 15% !important;
    text-align: center;
  }
  #ngon-ngu-icon {
    display: none;
  }
  #logo-user {
    padding: 0 !important;
  }
  .left-content {
    display: none;
  }
  .col-sm-10 {
    width: 100% !important;
  }

  .close {
    font-size: 20px !important;
  }

  p, strong, p strong, h6 strong, h6, input, label, button, select, span {
    font-size: 10px !important;
  }

  h5 {
    font-size: 20px !important;
  }

  #pie-chart {
    height: 350px !important;
  }

  #mobile-app-scan {
    text-align: center;
  }

  #mobile-app-scan img {
    width: 25% !important;
  }

  #options {
    margin: 5px 0 !important;
  }

  .status, .overview, .static-report {
    text-align: center;
    width: 100%;
  }

  .status a img,
  .overview a img,
  .static-report a img {
    width: 15% !important;
    margin: 0;
    padding: 0;
  }

  .status a span,
  .overview a span,
  .static-report a span {
    font-size: 10px !important;
  }

  .status .active,
  .overview .active,
  .static-report .active {
    height: 35px !important;
  }

  .status .active img,
  .overview .active img,
  .static-report .active img {
    padding: 0 !important;
  }
  
  table thead tr th,
  table tbody tr td{
    font-size: 11px;
  }

  .b-sidebar {
    width: 250px !important;
  }

  #trang-thai-icon img {
    width: 5% !important;
  }

  .col-sm-2 button {
    margin: 10px 0;
  }

  .b-sidebar {
    height: 100% !important;
  }

  .nav-link {
    padding: 0 !important;
  }

}

@media (min-width: 350px) and (max-width: 420px) {
  #text-project-info {
  padding-left: 10px !important;
  }
  #project-info .col-sm-3 {
    text-align: center;
  }
  #project-info-icon {
    width: 15% !important;
    text-align: center;
  }
  #ngon-ngu-icon {
    display: none;
  }
  #logo-user {
    padding: 0 !important;
  }
  .left-content {
    display: none;
  }
  .col-sm-10 {
    width: 100% !important;
  }

  .close {
    font-size: 20px !important;
  }

  p, strong, p strong, h6 strong, h6, input, label, button, select, span {
    font-size: 10px !important;
  }

  h5 {
    font-size: 20px !important;
  }

  #pie-chart {
    height: 350px !important;
  }

  #mobile-app-scan {
    text-align: center;
  }

  #mobile-app-scan img {
    width: 25% !important;
  }

  #options {
    margin: 5px 0 !important;
  }

  .status, .overview, .static-report {
    text-align: center;
    width: 100%;
  }

  .status a img,
  .overview a img,
  .static-report a img {
    width: 15% !important;
    margin: 0;
    padding: 0;
  }

  .status a span,
  .overview a span,
  .static-report a span {
    font-size: 10px !important;
  }

  .status .active,
  .overview .active,
  .static-report .active {
    height: 35px !important;
  }

  .status .active img,
  .overview .active img,
  .static-report .active img {
    padding: 0 !important;
  }
  
  table thead tr th,
  table tbody tr td{
    font-size: 11px;
  }

  .b-sidebar {
    width: 250px !important;
  }

  #trang-thai-icon img {
    width: 5% !important;
  }

  .col-sm-2 button {
    margin: 10px 0;
  }

  .b-sidebar {
    height: 100% !important;
  }

  .nav-link {
    padding: 0 !important;
  }
}

@media (min-width: 310px) and (max-width: 350px) {
  #project-info .col-sm-3 {
    text-align: center;
  }
  #project-info-icon {
    width: 15% !important;
    text-align: center;
  }
  #text-project-info {
  padding-left: 10px !important;
  }
  .nav-link a p {
    font-size: 9px !important;
  }
  #ngon-ngu-icon {
    display: none;
  }
  #logo-user {
    padding: 0 !important;
  }
  .left-content {
    display: none;
  }
  .col-sm-10 {
    width: 100% !important;
  }

  .close {
    font-size: 20px !important;
  }

  p, strong, p strong, h6 strong, h6, input, label, button, select, span {
    font-size: 10px !important;
  }

  h5 {
    font-size: 20px !important;
  }

  #pie-chart {
    height: 350px !important;
  }

  #mobile-app-scan {
    text-align: center;
  }

  #mobile-app-scan img {
    width: 25% !important;
  }

  #options {
    margin: 5px 0 !important;
  }

  .status, .overview, .static-report {
    text-align: center;
    width: 100%;
  }

  .status a img,
  .overview a img,
  .static-report a img {
    width: 15% !important;
    margin: 0;
    padding: 0;
  }

  .status a span,
  .overview a span,
  .static-report a span {
    font-size: 10px !important;
  }

  .status .active,
  .overview .active,
  .static-report .active {
    height: 35px !important;
  }

  .status .active img,
  .overview .active img,
  .static-report .active img {
    padding: 0 !important;
  }
  
  table thead tr th,
  table tbody tr td{
    font-size: 10px;
  }

  table {
    width: 100% !important;
  }

  .b-sidebar {
    width: 250px !important;
  }

  #trang-thai-icon img {
    width: 5% !important;
  }

  .col-sm-2 button {
    margin: 10px 0;
  }

  .b-sidebar {
    height: 100% !important;
  }

  .nav-link {
    padding: 0 !important;
  }


}
</style>
