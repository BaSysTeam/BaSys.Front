export default class TabViewModel {
title: string;
name: string;
uid: string;
isHeader:boolean;

constructor(params: any) {
  let data: any = {};
  if (params) {
    data = params;
  }
  this.title = data.title || '';
  this.name = data.name || '';
  this.uid = data.uid || '';
  this.isHeader = data.isHeader || false;
}
}
