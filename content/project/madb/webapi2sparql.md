+++
title = "MADB WebAPI to SPARQLクエリ変換"
description = "メディア芸術データベース(ベータ版)のSPARQLエンドポイント"
tags = []
categories = ["MADB"]
+++

[メディア芸術データベース（ベータ版）WebAPI](https://web.archive.org/web/20240112040313/https://mediaarts-db.bunka.go.jp/about#anc03)[^1]に対するリクエストを、ほぼ同等[^2]の検索結果が得られる[MADB Lab SPARQLクエリサービス](https://mediag.bunka.go.jp/madb_lab/lod/sparql/)の**SPARQLクエリ**へ変換します。

対応するWebAPI仕様/データセットのバージョンは以下のとおりです。

- WebAPI: [No.5 2022/02/17](https://web.archive.org/web/20231101234759/https://mediaarts-db.bunka.go.jp/resources/pdf/mediaartsdb_webapi_documents.pdf)
- SPARQLクエリ: [データセット 2022-10-26](https://mediag.bunka.go.jp/madb_lab/lod/download/)

<div id="app">
<form>
    <section>
        <h2>WebAPIリクエストパラメータ</h2>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="fieldId" class="f6 b db mb2">分野ID <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <select id="fieldId" v-model="apireq.fieldId" @change="onChangeFieldId" class="ba b--black-20 pa2 mb2 db w-100">
                    <option value=""></option>
                    <option value="manga">manga</option>
                    <option value="animation">animation</option>
                    <option value="game">game</option>
                    <option value="mediaart">mediaart</option>
                    <option value="collection">collection</option>
                </select>
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="categoryId" class="f6 b db mb2">情報資源分類ID <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <select id="categoryId" v-model="apireq.categoryId" class="ba b--black-20 pa2 mb2 db w-100">
                    <option value=""></option>
                    <option v-for="option in categoryIdOptions" :value="option">${ option }</option>
                </select>
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="subcategoryId" class="f6 b db mb2">情報資源小分類ID <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <select id="subcategoryId" v-model="apireq.subcategoryId" class="ba b--black-20 pa2 mb2 db w-100">
                    <option value=""></option>
                    <option v-for="option in subcategoryIdOptions" :value="option">${ option }</option>
                </select>
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="aipId" class="f6 b db mb2">保存データID <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="aipId" v-model="apireq.aipId" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="q" class="f6 b db mb2">フリーワード <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="q" v-model="apireq.q" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="sort" class="f6 b db mb2">ソートタイプ <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <select id="sort" v-model="apireq.sort" class="ba b--black-20 pa2 mb2 db w-100">
                    <option value="title">title</option>
                    <option value="date">date</option>
                </select>
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="offset" class="f6 b db mb2">取得開始件数 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="offset" v-model="apireq.offset" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="number" min="0" max="1000">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="limit" class="f6 b db mb2">最大取得件数 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="limit" v-model="apireq.limit" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="number" min="1" max="1000">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="name" class="f6 b db mb2">タイトル <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="name" v-model="apireq.name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="alternativeHeadline" class="f6 b db mb2">サブタイトル <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="alternativeHeadline" v-model="apireq.alternativeHeadline" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="genre" class="f6 b db mb2">ジャンル <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="genre" v-model="apireq.genre" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="label" class="f6 b db mb2">ラベル <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="label" v-model="apireq.label" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="seriesName" class="f6 b db mb2">シリーズ名 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="seriesName" v-model="apireq.seriesName" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="volumeNumber" class="f6 b db mb2">巻 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="volumeNumber" v-model="apireq.volumeNumber" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="issueNumber" class="f6 b db mb2">号 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="issueNumber" v-model="apireq.issueNumber" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="creator" class="f6 b db mb2">作者名 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="creator" v-model="apireq.creator" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="actor" class="f6 b db mb2">キャスト名 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="actor" v-model="apireq.actor" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="publisher" class="f6 b db mb2">発行者名 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="publisher" v-model="apireq.publisher" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="description" class="f6 b db mb2">概要 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="description" v-model="apireq.description" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="keywords" class="f6 b db mb2">キーワード・タグ <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="keywords" v-model="apireq.keywords" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
        <div class="measure cf flex items-center">
            <div class="fl w-40">
                <label for="inLanguage" class="f6 b db mb2">言語 <span class="normal black-60">(optional)</span></label>
            </div>
            <div class="fl w-60">
                <input id="inLanguage" v-model="apireq.inLanguage" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
            </div>
        </div>
    </section>
    <section>
        <h2>WebAPIリクエストURL</h2>
        <a :href="webApiQuery" target="_blank">${ webApiQuery }</a>
    </section>
    <section>
        <h2>SPARQLクエリ</h2>
        <textarea v-model="sparqlQuery" class="f5 w-100 pa2 code" rows="20" spellcheck="false" translate="no"></textarea>
        <a class="f6 b link dim br1 ph3 pv2 mb2 dib white bg-dark-blue" :href="sparqlMadbLabUrl" target="_blank">MADB Labで実行</a>
    </section>
</form>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.prod.js"></script>
<script src="/js/madb/webapi2sparql.js" type="module"></script>

[^1]: API仕様書 <https://web.archive.org/web/20231101234759/https://mediaarts-db.bunka.go.jp/resources/pdf/mediaartsdb_webapi_documents.pdf>
[^2]: 全文検索やソートの実装の差異、RDFのデータセットへ変換される過程で生じたと思われるデータ上の差異などが存在します。
