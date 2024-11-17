+++
title = "gBizINFO LOD"
description = "gBizINFOのSPARQLエンドポイント"
tags = []
categories = ["gBizINFO"]
toc = true
+++

経済産業省「[gBizINFO](https://info.gbiz.go.jp/)」でかつて[^1]提供されていた[SPARQL API バージョン 1.4](https://warp.ndl.go.jp/info:ndljp/pid/13539552/info.gbiz.go.jp/api/document/API.pdf)と同等[^2]のデータを提供するSPARQLエンドポイントです。

データセット生成については以下リポジトリをご覧ください。

- [Babibubebon/gbizinfo-lod](https://github.com/Babibubebon/gbizinfo-lod): CSV to RDF変換ツール
- [Babibubebon/gbizinfo-lod-dataset](https://github.com/Babibubebon/gbizinfo-lod-dataset): 生成したデータセット(週1更新)

[^1]: [RDF廃止（サービス終了）のお知らせ](https://info.gbiz.go.jp/html/RdfStop.html)
[^2]: 互換性を保つように作ったつもりですが、gBizINFO提供当時の全てのRDFデータダンプがないので厳密な検証はできていません。誤りがあれば、[gbizinfo-lod](https://github.com/Babibubebon/gbizinfo-lod)のissuesで教えてください。

-----

データ更新日: <date>`2024-11-10`</date>

Endpoint: `https://sparql.metadata.moe/gbizinfo/query`

## クエリエディタ

{{< yasgui id="gbizinfo" endpoint="https://sparql.metadata.moe/gbizinfo/query"
    default-query=`
PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT *
{
  GRAPH <http://hojin-info.go.jp/graph/hojin> {
    ?s hj:法人基本情報 ?kihon.
    ?kihon ic:ID/ic:識別値 ?hojinBango ;
           ic:名称 [
                ic:種別 '商号又は名称';
              ic:表記 ?name ;
           ]
    .
    OPTIONAL {
        ?kihon ic:名称 [
                   ic:種別 '商号又は名称';
               ic:カナ表記 ?nameKana ;
           ]
    }
    OPTIONAL {
        ?kihon ic:名称 [
                   ic:種別 '商号又は名称(英語表記)';
               ic:表記 ?nameEn ;
           ]
    }
    OPTIONAL {
        ?kihon ic:住所 [
             ic:種別 '住所' ;
             ic:表記 ?address ;
        ]
    }
  }
}
LIMIT 100`
>}}

## 全文検索

[API仕様書「7 フルテキスト検索」](https://warp.ndl.go.jp/info:ndljp/pid/13539552/info.gbiz.go.jp/api/document/API.pdf#page=50)に相当する `ic:表記` プロパティに対する全文検索をサポートしています。

ただし、本エンドポイントでは[Jena Full Text Search](https://jena.apache.org/documentation/query/text-query.html#entity-map-definition)を利用しているため、全文検索に用いる構文が異なります。

{{< yasgui-query yasgui-id="gbizinfo" title="法人名を指定して検索する" >}}
PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX text: <http://jena.apache.org/text#>

SELECT DISTINCT ?corporateID ?corporateName ?location
{
  GRAPH <http://hojin-info.go.jp/graph/hojin> {
    (?key ?score) text:query (ic:表記 '"日立製作所"' 100) .

    ?s ic:ID/ic:識別値 ?corporateID ;
       ic:名称 ?key ;
       ic:住所/ic:表記 ?location .
    ?key ic:表記 ?corporateName .
  }
}
ORDER BY DESC(?score)
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="gbizinfo" title="所在地を指定して検索する" >}}
PREFIX hj: <http://hojin-info.go.jp/ns/domain/biz/1#>
PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX text: <http://jena.apache.org/text#>

SELECT DISTINCT ?corporateID ?corporateName ?location
{
  GRAPH <http://hojin-info.go.jp/graph/hojin> {
    (?key ?score) text:query (ic:表記 '"東京都千代田区"' 1000) .

    ?s ic:ID/ic:識別値 ?corporateID ;
       ic:名称/ic:表記 ?corporateName ;
       ic:住所 ?key .
    ?key ic:表記 ?location .
  }
}
ORDER BY DESC(?score)
{{< /yasgui-query >}}

ご注意: 1トリプルが1ドキュメント(Lucene)に対応するシンプルなインデクシングであるため、空白ノードを多用するgBizINFOのデータモデルにおいては、複数の主語に対する複合的な全文検索が実用的でないケースがあります。例えば、法人名と所在地の表記に対してAND条件で全文検索しようとすると、それぞれの全文検索結果の主語の全組み合わせに対するパターンマッチを要するため、あっという間に現実的な時間でクエリが終わらなくなります。まず少数の結果に絞り込むことができる全文検索を実行した上で、それに対してFILTERするようなクエリに書き換えるなど、工夫が必要です。

## 名前付きグラフ一覧

- 法人基本情報: `http://hojin-info.go.jp/graph/hojin`
- 補助金情報: `http://hojin-info.go.jp/graph/hojyokin`
- 調達情報: `http://hojin-info.go.jp/graph/chotatsu`
- 表彰情報: `http://hojin-info.go.jp/graph/hyosho`
- 届出認定情報: `http://hojin-info.go.jp/graph/todokede`
- 特許情報: `http://hojin-info.go.jp/graph/tokkyo`
- 職場情報: `http://hojin-info.go.jp/graph/shokuba`
- 財務情報: `http://hojin-info.go.jp/graph/zaimu`
- 共通コード: `http://hojin-info.go.jp/graph/commonCode`

デフォルトグラフは、上記の名前付きグラフの和集合ですが、パフォーマンス上明示的に指定したほうが良いです。
