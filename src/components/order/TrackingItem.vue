<template>
  <div class="fold">
    <div class="tracking" :style="orangeColor" @click="showSubTrack">
      <div class="tracking-time">
        <div class="date">{{track.local_day}}</div>
        <div class="time">{{track.local_time}}</div>
      </div>
      <div class="tracking-icon">
        <div class="icon" :style="iconStyle">
          <i class="iconfont" :style="orangeColor" :class="icon" v-if="icon"></i>
          <div class="dot" :style="orangeColorBg" v-else></div>
        </div>
        <div class="horizontal" style="height: 10px;" v-if="!icon" :class="{dash: icon && (!track.active || track.activeItem)}"></div>
        <div class="horizontal" :class="{dash: !track.active || track.activeItem}" v-if="!track.last"></div>
      </div>
      <div class="tracking-text">
        <a :href="track.link_url" v-if="track.link_url" target="_blank">{{track.title}}</a>
        <div v-else class="title" @click="click" :style="{cursor: track.link_url ? 'pointer': ''}">{{track.title}}</div>
        <div class="des">{{track.msg}}</div>
        <a href="/views/document.html?type=factoryprice" target="_blank" class="notice" v-if="track.state === 'warehouse-preparing' && track.activeItem">
          why does it take a longer time to process my order?
        </a>
      </div>
    </div>
    <div class="sub-tracking" ref="subTracking">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'track'
  ],
  created () {
    console.log('track', this.track)
    switch (this.track.state) {
      case 'so-confirmed':
        this.icon = 'icon-J_Orders'
        break
      case 'factories-preparing':
        this.icon = 'icon-Factory'
        break
      case 'warehouse-preparing':
        this.icon = 'icon-Ankerwebicon-'
        break
      case 'manifested':
        this.icon = 'icon-daifahuo'
        break
      case 'delivered': case 'returned':
        this.icon = 'icon-J_Shipped'
        break
    }
  },
  mounted () {
    if (this.track.isShowSub) {
      this.$refs.subTracking.style.maxHeight = '1000px'
    }
  },
  data () {
    return {
      icon: ''
    }
  },
  methods: {
    click () {
      if (this.track.link_url) {
        window.location.href = this.track.link_url
      }
    },
    showSubTrack () {
      let maxHeight = this.$refs.subTracking.style.maxHeight
      if (maxHeight) {
        this.$refs.subTracking.style.maxHeight = ''
      } else {
        this.$refs.subTracking.style.maxHeight = '1000px'
      }
    }
  },
  computed: {
    iconStyle () {
      let style = {}
      if (!this.icon) {
        style = {
          height: '0px',
          border: 'none',
          marginLeft: '2px'
        }
      }
      if (this.track.activeItem) {
        style.borderColor = '#FB8E00'
      } else if (!this.track.active) {
        style.borderColor = '#C5C5C5'
      }
      return style
    },
    orangeColor () {
      return this.track.activeItem ? {
        color: '#FB8E00',
        borderColor: '#FB8E00'
      } : !this.track.active ? {
        color: '#C5C5C5',
        borderColor: '#C5C5C5'
      } : {}
    },
    orangeColorBg () {
      return this.track.activeItem ? {
        background: '#FB8E00'
      } : !this.track.active ? {
        color: '#C5C5C5',
        borderColor: '#C5C5C5'
      } : {}
    }
  }
}
</script>

<style lang="scss" scoped>
  $main-color : #666;
  .fold {
    .tracking {
      cursor: pointer;
      color: $main-color;
      display: flex;
      .tracking-time {
        text-align: right;
        width: 80px;
        .date {
          font-size: 14px;
        }
        .time {
          font-size: 12px;
        }
      }
      .tracking-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 10px;
        .icon {
          height: 25px;
          width: 25px;
          border: solid 1px $main-color;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          i {
            font-size: 16px;
            &.icon-Ankerwebicon- {
              margin-left: 3px;
            }
            &.icon-daifahuo {
              margin-left: 1px;
              margin-top: 2px;
              font-size: 18px;
            }
            &.icon-J_Shipped {
              font-size: 18px;
            }
          }
          .dot {
            height: 5px;
            width: 5px;
            background: $main-color;
            border-radius: 100%;
            position: absolute;
            top: 10px;
            left: 9px;
          }
        }
        .horizontal {
          width: 1px;
          height: 80px;
          background-color: $main-color;
          &.dash {
            background-image: linear-gradient(to bottom, #c5c5c5 80%, rgba(255, 255, 255, 0) 20%);
            background-position: left;
            background-size: 1px 10px;
            background-repeat: repeat-y;
            background-color: initial;
          }
        }
      }
      .tracking-text {
        font-size: 14px;
        .title {
          font-weight: 600;
        }
        a {
          text-decoration: underline;
          cursor: pointer;
          user-select: none;
          color: $havelock-blue;
        }
      }
    }
    .sub-tracking {
      transition: all 300ms cubic-bezier(0.77, 0, 0.175, 1);
      height: auto;
      max-height: 0px;
      overflow: hidden;
    }
  }
</style>
