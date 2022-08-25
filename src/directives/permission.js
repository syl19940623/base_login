import Vue from 'vue';

const permission = Vue.directive('permission', {
  inserted: function (el, binding) {
    const btnSymbol = binding.value
    const permissionList = JSON.parse(localStorage.getItem('roleButtons'))
    if (!permissionList.includes(btnSymbol)) {
      el.parentNode.removeChild(el);
    }
  }
})