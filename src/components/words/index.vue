<template>
  <view
    class="word-bg word relative"
    :class="[`word-len-${word.length}`, courseId == 1 ? '': 'en', xiezi ? 'xiezi': '']"
    @tap="$emit('toggle-selected', id)"
  >
    <view
      v-if="courseId == 1"
      class="flex"
    >
      <view
        v-for="(w, idx) in word.split('')"
        :key="idx"
        class="word relative"
        :class="[selected ? 'text-yellow-400 font-bold': '']"
      >
        {{ w }}
        <!-- <view class="absolute w-1 h-1 bg-teal-600 rounded-full top-0 right-0" /> -->
      </view>
    </view>
    <view
      v-if="courseId == 2"
      class="word-en"
    >
      {{ word }}
    </view>

    <image
      v-if="selected"
      :src="checkOnIcon"
      class="w-4 h-4 absolute top-0 right-0"
    />
  </view>
</template>
<script>
import checkOnIcon from "../../assets/img/icon/check-on.svg"

import { mapState } from 'vuex'
export default {
  props: {
    word: {
      type: String,
      default: ''
    },
    xiezi: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    id: {
      type: [Number, String],
      default: ''
    }
  },
  computed: {
    ...mapState('lesson', ['courseId'])
  },
  data() {
    return {
      checkOnIcon
    }
  }
}
</script>
