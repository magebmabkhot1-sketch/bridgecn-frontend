import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        login: 'Login',
        signup: 'Sign up',
        dashboard: 'Dashboard',
        students: 'Students',
        messages: 'Messages',
        events: 'Events',
        feed: 'Feed',
        profile: 'Profile',
        logout: 'Logout'
      },
      hero: {
        title: 'Connect Beyond Language',
        subtitle: 'A verified university network connecting Chinese and international students across China',
        joinWaitlist: 'Join Waitlist',
        learnMore: 'Learn More'
      },
      waitlist: {
        title: 'Join the BridgeCN waitlist',
        submit: 'Submit',
        success: 'You are on the waitlist. We will contact you soon.'
      },
      buttons: {
        save: 'Save',
        cancel: 'Cancel',
        search: 'Search'
      },
      auth: {
        email: 'Email',
        password: 'Password',
        fullName: 'Full Name'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        about: '关于',
        login: '登录',
        signup: '注册',
        dashboard: '仪表盘',
        students: '学生',
        messages: '消息',
        events: '活动',
        feed: '动态',
        profile: '个人资料',
        logout: '退出登录'
      },
      hero: {
        title: '超越语言，连接彼此',
        subtitle: '一个经过验证的高校社交网络，连接中国与国际学生',
        joinWaitlist: '加入候补名单',
        learnMore: '了解更多'
      },
      waitlist: {
        title: '加入 BridgeCN 候补名单',
        submit: '提交',
        success: '你已成功加入候补名单，我们会尽快联系你。'
      },
      buttons: {
        save: '保存',
        cancel: '取消',
        search: '搜索'
      },
      auth: {
        email: '邮箱',
        password: '密码',
        fullName: '姓名'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('bridgecn_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
