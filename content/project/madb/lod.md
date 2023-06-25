+++
title = "メディア芸術データベース SPARQLエンドポイント (Unofficial)"
date = 2020-10-07T02:03:54+09:00
description = "メディア芸術データベース(ベータ版)のSPARQLエンドポイント"
tags = []
categories = ["SPARQL"]
aliases = [
    '/project/madb-lod/'
]
+++

メディア芸術データベース(ベータ版)のLODデータセット[^1]のSPARQLエンドポイントです。

<div class="bw3 bl ph2 b--green">

**Notice**

「[メディア芸術データベース・ラボ](https://mediag.bunka.go.jp/madb_lab/) (MADB Lab)」でSPARQLエンドポイントが提供されるようになったため、お役御免となりました。
本エンドポイントは既存利用者のためにしばらく公開は続けますが、今後はMADB Labの利用を推奨します。

</div>

<div class="bw3 bl ph2">

**Note**

過去にこちらのページで提供していた独自のデータセットは[メディア芸術データベース LOD (Deprecated)]({{< relref "old.md" >}})に移動しました。

</div>

## Query with SPARQL

Endpoint: `https://sparql.metadata.moe/madb/query` ([**2022/06/15版**]({{< relref "diff.md" >}}))

{{< yasgui id="madb-lod"
    endpoint="https://sparql.metadata.moe/madb/query"
default-query=`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>
PREFIX class:    <https://mediaarts-db.bunka.go.jp/data/class/>
PREFIX ma:       <https://mediaarts-db.bunka.go.jp/data/property/>
PREFIX maadmin:  <https://mediaarts-db.bunka.go.jp/data/property-admin/>
PREFIX madbdata: <https://mediaarts-db.bunka.go.jp/data/property-data/>
PREFIX madev:    <https://mediaarts-db.bunka.go.jp/data/property-dev/>
SELECT * WHERE {
  ?sub ?pred ?obj .
} LIMIT 10`
>}}

### Examples

- {{< yasgui-query yasgui-id="madb-lod" title="公開年毎にTVアニメシリーズ数を集計する"
query=`PREFIX schema: <https://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX class: <https://mediaarts-db.bunka.go.jp/data/class#>
SELECT ?y (COUNT(DISTINCT *) AS ?cnt)  WHERE {
  ?s a class:AnimationTVRegularSeries ;
     schema:datePublished ?datePublished .
}
GROUP BY (SUBSTR(?datePublished, 1, 4) AS ?y)
ORDER BY DESC(?y)
` >}}

- {{< yasgui-query yasgui-id="madb-lod" title="タイトルに「!」「?」を多く含むTVアニメを取得する "
query=`PREFIX schema: <https://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX class: <https://mediaarts-db.bunka.go.jp/data/class#>
SELECT ?s ?name ?mark WHERE {
  ?s a class:AnimationTVRegularSeries ;
     rdfs:label ?name .
  FILTER(LANG(?name) = "")
  FILTER (REGEX(?name, "[!！\\?？]+"))
  BIND (REPLACE(?name, "[^!！\\?？]*([!！\\?？]+)[^!！\\?？]*", "$1") AS ?mark)
}
ORDER BY DESC(STRLEN(?mark))
LIMIT 100
` >}}

- {{< yasgui-query yasgui-id="madb-lod" title="岡田麿里さん参加作品を取得する"
query=`PREFIX schema: <https://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX class: <https://mediaarts-db.bunka.go.jp/data/class#>
SELECT
 ?col ?colName (GROUP_CONCAT(DISTINCT ?role) AS ?roles)
WHERE {
  ?col a ?class ;
         schema:genre ?genre ;
         rdfs:label ?colName ;
         ^schema:isPartOf ?item .
  VALUES ?class {class:AnimationTVRegularSeries class:AnimationTVSpecialSeries class:AnimationMovieSeries}
  {
   ?col schema:contributor ?contributers .
  } UNION {
    ?item schema:contributor ?contributers .
  }
  FILTER(LANG(?colName) = "")
  FILTER(REGEX(?contributers, "岡田\\s*麿里"))
  BIND(REPLACE(?contributers, ".*\\[(.+?)\\]岡田\\s*麿里.*", "$1") AS ?role)
}
GROUP BY ?col ?colName
` >}}

- {{< yasgui-query yasgui-id="madb-lod" title="情報資源分類一覧を取得する"
query=`PREFIX schema: <https://schema.org/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX class: <https://mediaarts-db.bunka.go.jp/data/class/>

# 情報資源分類
# Ref. <https://github.com/mediaarts-db/dataset/blob/ea0d43b555f412b127bb2e8127b7469d6e42fa29/README.md#211-%E6%83%85%E5%A0%B1%E8%B3%87%E6%BA%90%E5%88%86%E9%A1%9E>

SELECT
 DISTINCT (?additionalType AS ?分野) (?class AS ?大分類) (?genre AS ?小分類)
WHERE {
  ?col a ?class;
     schema:additionalType ?additionalType ;
         schema:genre ?genre .
}
` >}}

---

## ご利用にあたって

- 本サービスは、[文化庁「メディア芸術データベース（ベータ版）」](https://mediaarts-db.bunka.go.jp/)が公開しているデータセットを利用しています。データセットの内容は改変しておりません(SPARQLサーバやクライアントソフトウェアの制約に起因する場合は、この限りではありません)。
- データセットの利用に当たっては、[メディア芸術データベース 利用規約](https://mediaarts-db.bunka.go.jp/user_terms)も併せてお読みください。
- 本サービスは、個人が独自に提供しているものですので、文化庁にお問い合わせされないようご注意ください。連絡は[こちら](https://babibubebo.org/about/contact/)にお願いします。


[^1]: <https://github.com/mediaarts-db/dataset>