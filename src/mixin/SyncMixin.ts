import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import store from "@/store";
import isEmpty from "lodash/isEmpty";

const querystring = require("querystring");

@Component
export default class SyncMixin extends Vue {
  store: string = "";
  tag: string = "";
  id: string | number | string[] = "";

  enableLoading: boolean = false;
  loadingText: any = null;

  openLoading() {
    this.$hui.loading.show(this.loadingText);
  }

  closeLoading() {
    this.$hui.loading.hide();
  }

  switchLoading(status) {
    if (!this.enableLoading) return;
    return status ? this.openLoading() : this.closeLoading();
  }

  @Watch("listLoading")
  onListLoadingChanged() {
    this.loadingText = "正在加载...";
    this.switchLoading(this.listLoading);
  }

  @Watch("entityLoading")
  onEntityLoadingChanged() {
    this.loadingText = "正在加载...";
    this.switchLoading(this.entityLoading);
  }

  @Watch("entitySaveLoading")
  onEntitySaveLoadingChanged() {
    this.loadingText = "请求中...";
    this.switchLoading(this.entitySaveLoading);
  }

  @Watch("entityDeleteLoading")
  onEntityDeleteLoadingChanged() {
    this.loadingText = "正在删除...";
    this.switchLoading(this.entityDeleteLoading);
  }

  get list() {
    if (isEmpty(this.store)) {
      return [];
    }
    const key = `${this.store}/getListByTag`;
    return store.getters[key](this.tag);
  }

  get listFinished() {
    return this.list.length === this.listTotal;
  }

  get listTotal() {
    if (isEmpty(this.store)) {
      return 0;
    }
    const key = `${this.store}/getListTotalByTag`;
    return store.getters[key](this.tag);
  }

  get listError() {
    const key = `${this.store}/getListErrorByTag`;
    return store.getters[key](this.tag);
  }

  get listLoading() {
    if (isEmpty(this.store)) {
      return false;
    }
    const key = `${this.store}/getListLoadingByTag`;
    return store.getters[key](this.tag);
  }

  get listSums() {
    if (isEmpty(this.store)) {
      return false;
    }
    const key = `${this.store}/getListSumsByTag`;
    return store.getters[key](this.tag);
  }

  get listCounts() {
    if (isEmpty(this.store)) {
      return false;
    }
    const key = `${this.store}/getListCountsByTag`;
    return store.getters[key](this.tag);
  }

  get entity() {
    if (isEmpty(this.store)) {
      return {};
    }
    const key = `${this.store}/getById`;
    return store.getters[key](this.id);
  }

  get entityError() {
    const key = `${this.store}/getErrorById`;
    return store.getters[key](this.id);
  }

  get entityLoading() {
    if (isEmpty(this.store)) {
      return false;
    }
    const key = `${this.store}/getLoadingById`;
    return store.getters[key](this.id);
  }

  get entitySaveLoading() {
    if (isEmpty(this.store)) {
      return false;
    }
    const key = `${this.store}/getSaveLoadingById`;
    return store.getters[key](this.id);
  }

  get entitySaveError() {
    const key = `${this.store}/getSaveErrorById`;
    return store.getters[key](this.id);
  }

  get entityDeleteLoading() {
    if (isEmpty(this.store)) {
      return false;
    }
    const key = `${this.store}/getDeleteLoadingById`;
    return store.getters[key](this.id);
  }

  get entityDeleteError() {
    const key = `${this.store}/getDeleteErrorById`;
    return store.getters[key](this.id);
  }

  encodeTag(obj) {
    if (isEmpty(obj)) {
      return "";
    }
    return querystring.encode(obj);
  }

  normalizeKey(key) {
    if (!key) {
      return "";
    }
    return "" + key;
  }

  commitChanges(id, changes) {
    const key = `${this.store}/update`;
    return store.commit(key, {
      id: id,
      changes: changes,
    });
  }

  commitNew(data) {
    this.id = data.data.id;
    const key = `${this.store}/saveSuccess`;
    return store.commit(key, {
      key: this.normalizeKey(this.id),
      response: data,
    });
  }

  defaultFailureHandler(err) {
    const message = this.$options.filters.safe(
      err,
      "response.data.message",
      null
    );
    if (message) {
      this.$hui.toast.error(message);
    }
  }

  loadEntityExtra(kwargs: any = {}) {
    const action = `${kwargs.store}/get`;
    store.dispatch(action, {
      id: kwargs.id,
      restore: kwargs.restore,
      requireColumns: kwargs.requireColumns,
      query: kwargs.query,
      headers: kwargs.headers,
      configs: kwargs.configs,
      success: kwargs.success,
      failure: kwargs.failure || this.defaultFailureHandler,
    });
  }

  loadList(kwargs: any = {}) {
    if (this.listLoading) {
      return;
    }

    const resource = kwargs.store || this.store;
    const tag = kwargs.tag || this.tag;
    const action = `${resource}/list`;
    store.dispatch(action, {
      tag: tag,
      reset: kwargs.reset,
      query: kwargs.query,
      header: kwargs.headers,
      configs: kwargs.configs,
      success: kwargs.success,
      failure: kwargs.failure || this.defaultFailureHandler,
    });
  }

  loadEntity(kwargs: any = {}) {
    if (this.entityLoading) {
      return;
    }
    const resource = kwargs.store || this.store;
    const id = kwargs.id || this.id;
    const action = `${resource}/get`;
    store.dispatch(action, {
      id: id,
      lazy: kwargs.lazy,
      restore: kwargs.restore,
      query: kwargs.query,
      header: kwargs.headers,
      configs: kwargs.configs,
      success: kwargs.success,
      failure: kwargs.failure || this.defaultFailureHandler,
    });
  }

  saveEntity(kwargs: any = {}) {
    if (this.entitySaveLoading) {
      return;
    }
    const resource = kwargs.store || this.store;
    const tag = kwargs.tag || this.tag;
    const id = kwargs.id || this.id;
    const action = `${resource}/save`;
    store.dispatch(action, {
      syncTag: tag,
      id: id,
      res: kwargs.res,
      query: kwargs.query,
      header: kwargs.headers,
      configs: kwargs.configs,
      success: kwargs.success,
      failure: kwargs.failure || this.defaultFailureHandler,
    });
  }

  deleteEntity(kwargs: any = {}) {
    if (this.entityDeleteLoading) {
      return;
    }
    const resource = kwargs.store || this.store;
    const tag = kwargs.tag || this.tag;
    const id = kwargs.id || this.id;
    const action = `${resource}/delete`;
    store.dispatch(action, {
      syncTag: tag,
      id: id,
      res: kwargs.res,
      query: kwargs.query,
      header: kwargs.headers,
      configs: kwargs.configs,
      success: kwargs.success,
      failure: kwargs.failure || this.defaultFailureHandler,
    });
  }
}
