# from 表单组件

**demo：[预览地址](http://huangjingsheng.gitee.io/hjs/uni-app/#/pages/form)**

这里只实现两个核心组件`<TheForm />`和`<TheFormItem />`；因为移动端样式变化比较灵活，如果把所有表单组件都封装成`element-ui`或者`vant-ui`这类型一体库的话，导致很多无用代码和性能开销，所以这里只提供必需的功能组件，其他表单组件根据实际情况定义，保证高度灵活性。

## `<TheForm />`

参数说明：

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- | 
| model | object | 是 | 表单绑定的值（表单数据） |
| rules | object | 否 | 表单验证数据（和`element-ui`一致） |
| labelWidth | string | 否 | 表单字段宽度，`px`、`rpx`、`%` |
| labelPosition | string: `left`,`right`,`top` | 否 | 表单字段排版，默认`left` |
| border | boolean | 否 | 是否需要显示底部边框，默认`false` |

和`element-ui`差异：
1. `rules`移除了`validator`，增加了`reg`正则匹配；
2. `rules`移除了`change`触发条件，组件内部做了智能触发机制；


事件/方法说明：

| 方法 |  参数 | 参数说明 | 说明 |
| --- | --- | --- | --- | 
| validate(callback(...)) | callback(isValid, rules) | 有两个回调参数，和`element-ui`一致 | 表单验证 |
| validateField(prop, callback(...)) | `prop`是指定验证的键值，`callback`和上面一致 | 有两个回调参数，和`element-ui`一致 | 指定验证某个字段 |
| resetFields() | - | - | 移除所有校验 |
| resetField(prop) | `prop`是指定移除验证的键值 | - | 移除所有校验 |

## `<TheFormItem />`

参数说明：

| props |  类型 | 是否必选 | 说明 |
| --- | --- | --- | --- | 
| label | string | 否 | 表单展示字段 |
| prop | string | 否 | 表单对象`key`字段 |
| labelWidth | string | 否 | 表单字段宽度，`px`、`rpx`、`%`；优先级高于父组件 |
| labelPosition | string: `left`,`right`,`top` | 否 | 表单字段排版，默认`left`；优先级高于父组件 |
| border | boolean | 否 | 是否需要显示底部边框，默认`false`；优先级高于父组件 |

## 使用示例

```html
<template>
    <view>
        <TheForm :model="formData" :rules="formRules" labelWidth="160rpx" labelPosition="left" ref="the-form">
            <TheFormItem prop="userName" label="用户名">
                <input class="the-input" type="text" v-model="formData.userName" :placeholder="formRules.userName[0].message">
            </TheFormItem>
            <TheFormItem prop="phone" label="用户手机号">
                <input class="the-input" type="number" v-model="formData.phone" :placeholder="formRules.phone[0].message">
            </TheFormItem>
            <TheFormItem prop="avatar" label="用户头像" :border="false">
                <UploadImage :src="formData.avatar" @change="onUpload" />
            </TheFormItem>
        </TheForm>
        <button @click="onSubmit()">提交表单</button>
        <button @click="onReset()">重置表单</button>
        <button @click="validatePhone()">验证手机号码</button>
        <button @click="resetPhone()">重置验证手机号码</button>
    </view>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TheForm from "@/components/Form/TheForm.vue";
import TheFormItem from "@/components/Form/TheFormItem.vue";
import UploadImage from "@/components/UploadImage.vue";
import utils from "@/utils";

interface FormDataType {
    userName: string,
    phone: "" | number,
    avatar: string
}

@Component({
    components: {
        TheForm,
        TheFormItem,
        UploadImage
    }
})
export default class FormPage extends Vue {

    hasBorder = true;

    formData: FormDataType = {
        userName: "",
        phone: "",
        avatar: ""
    }

    formRules: TheForm["rules"] = {
        userName: [
            { required: true, message: "请输入用户名" }
        ],
        phone: [
            { required: true, message: "请输入用户手机号" },
            { reg: /^1[345678]\d{9}$/, message: "手机号不正确" }
        ]
    }

    onUpload(res: { id: string, src: string }) {
        this.formData.avatar = res.src;
    }

    onSubmit() {
        const form: TheForm = this.$refs["the-form"] as any;
        if (valid) {
            console.log("表单数据 >>", this.formData);
        } else {
            const keys = Object.keys(reuls);
            const firstProp = keys[0];
            utils.showToast(`${reuls[firstProp][0].message}`);
        }
    }

    onReset() {
        const form: TheForm = this.$refs["the-form"] as any;
        form.resetFields();
    }

    /** 验证手机号码 */
    validatePhone() {
        const form: TheForm = this.$refs["the-form"] as any;
        form.validateField("phone", (valid, rules) => {
            if (valid) {
                utils.showToast("手机验证通过");
            } else {
                utils.showToast(rules["phone"][0].message as string);
            }
        })
    }

    /** 移除验证手机号 */
    resetPhone() {
        const form: TheForm = this.$refs["the-form"] as any;
        form.resetField("phone");
    }
    
}
</script>
```