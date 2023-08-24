+++
title = "MADB データセット比較"
tags = []
categories = ["SPARQL"]
+++

## バージョン別エンドポイント

データセットのバージョン別のSPARQLエンドポイントを富豪的に立てました。

GitHubの[mediaarts-db/dataset](https://github.com/mediaarts-db/dataset)で公開されているデータセットは、タグが登録されているものとそうでないものがあるため、コミットメッセージとして記述されている日付を実質的なバージョンとして扱います。

[MADB Lab](https://mediag.bunka.go.jp/madb_lab/)でのみ更新されているデータセットについては、ダウンロードページに記載の `Updated on YYYY-MM-DD` の日付をバージョンとして扱います。

|Endpoint|Version|
|:-|:-|
|`https://sparql.metadata.moe/madb-20210125/query`|GitHub [2021/01/25](https://github.com/mediaarts-db/dataset/releases/tag/0.9)|
|`https://sparql.metadata.moe/madb-20210322/query`|GitHub [2021/03/22](https://github.com/mediaarts-db/dataset/releases/tag/1.0)|
|`https://sparql.metadata.moe/madb-20211011/query`|GitHub [2021/10/11](https://github.com/mediaarts-db/dataset/tree/dd3d8ecccd0b814891959c2fe566772d9f897afc)|
|`https://sparql.metadata.moe/madb-20220217/query`|GitHub [2022/02/17](https://github.com/mediaarts-db/dataset/tree/76f7813a6d1f22eaca6683ba4793f5c19464d181)|
|`https://sparql.metadata.moe/madb-20221026/query`|MADB Lab [2022/10/26](https://warp.ndl.go.jp/info:ndljp/pid/12363956/mediag.bunka.go.jp/madb_lab/lod/download)|
|`https://sparql.metadata.moe/madb-20230323/query`|MADB Lab [2023/03/23](https://warp.ndl.go.jp/info:ndljp/pid/12772296/mediag.bunka.go.jp/madb_lab/lod/download)|
|`https://sparql.metadata.moe/madb-20230428/query`|MADB Lab [2023/04/28](https://warp.ndl.go.jp/info:ndljp/pid/12865217/mediag.bunka.go.jp/madb_lab/lod/download)|
|`https://sparql.metadata.moe/madb-20230518/query`|MADB Lab [2023/05/18](https://warp.ndl.go.jp/info:ndljp/pid/12891338/mediag.bunka.go.jp/madb_lab/lod/download)|
|`https://sparql.metadata.moe/madb-20230615/query`|MADB Lab [2023/06/15](https://warp.ndl.go.jp/info:ndljp/pid/12930831/mediag.bunka.go.jp/madb_lab/lod/download)|
|N/A|GitHub [2023/07/26](https://github.com/mediaarts-db/dataset/releases/tag/1.1)|

## 比較用クエリ

いずれも激重クエリなので、結果が返るまで辛抱してお待ちください（連打するとサーバが死んでしまいます）。

- {{< yasgui-query yasgui-id="madb-lod-diff" title="総トリプル数"
query=`SELECT *
{
  {
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT ("20210125" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20210322/query> {
      SELECT ("20210322" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20211011/query> {
      SELECT ("20211011" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20220217/query> {
      SELECT ("20220217" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20221026/query> {
      SELECT ("20221026" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230323/query> {
      SELECT ("20230323" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230428/query> {
      SELECT ("20230428" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230518/query> {
      SELECT ("20230518" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230615/query> {
      SELECT ("20230615" AS ?version) (COUNT(*) AS ?cnt) WHERE {
        ?s ?p ?o .
      }
    }
  }
}` >}}

- {{< yasgui-query yasgui-id="madb-lod-diff" title="分野別エンティティ数"
query=`PREFIX schema: <https://schema.org/>

SELECT ?normalizedAdditionalType ?version ?cnt
{
  {
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT ("20210125" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20210322/query> {
      SELECT ("20210322" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20211011/query> {
      SELECT ("20211011" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20220217/query> {
      SELECT ("20220217" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20221026/query> {
      SELECT ("20221026" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230323/query> {
      SELECT ("20230323" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230428/query> {
      SELECT ("20230428" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230518/query> {
      SELECT ("20230518" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230615/query> {
      SELECT ("20230615" AS ?version) ?additionalType (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType ?additionalType .
      }
      GROUP BY ?additionalType
    }
  }
  # 20220217以降でPREFIXが変わったため
  BIND (URI(REPLACE(STR(?additionalType), "class/", "class#")) AS ?normalizedAdditionalType)
}
ORDER BY ?normalizedAdditionalType ?version
` >}}

- {{< yasgui-query yasgui-id="madb-lod-diff" title="使用しているクラス"
query=`SELECT ?type (GROUP_CONCAT(?version ; separator=",") AS ?versions)
{
  {
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT DISTINCT ("20210125" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20210322/query> {
      SELECT DISTINCT ("20210322" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20211011/query> {
      SELECT DISTINCT ("20211011" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20220217/query> {
      SELECT DISTINCT ("20220217" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20221026/query> {
      SELECT DISTINCT ("20221026" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230323/query> {
      SELECT DISTINCT ("20230323" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230428/query> {
      SELECT DISTINCT ("20230323" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230518/query> {
      SELECT DISTINCT ("20230518" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230615/query> {
      SELECT DISTINCT ("20230615" AS ?version) ?type WHERE {
        ?s a ?type .
      }
    }
  }
}
GROUP BY ?type
` >}}

- {{< yasgui-query yasgui-id="madb-lod-diff" title="使用しているプロパティ"
query=`SELECT ?p (GROUP_CONCAT(?version ; separator=",") AS ?versions)
{
  {
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT ("20210125" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20210322/query> {
      SELECT ("20210322" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20211011/query> {
      SELECT ("20211011" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20220217/query> {
      SELECT ("20220217" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20221026/query> {
      SELECT ("20221026" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230323/query> {
      SELECT ("20230323" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230428/query> {
      SELECT ("20230428" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230518/query> {
      SELECT ("20230518" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230615/query> {
      SELECT ("20230615" AS ?version) ?p WHERE {
        ?s ?p ?o .
      }
      GROUP BY ?p
    }
  }
}
GROUP BY ?p
ORDER BY ?p
` >}}

- {{< yasgui-query yasgui-id="madb-lod-diff" title="使用しているジャンル(schema:genre)"
query=`PREFIX schema: <https://schema.org/>

SELECT ?genre (GROUP_CONCAT(?version ; separator=",") AS ?versions)
{
  {
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT DISTINCT ("20210125" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20210322/query> {
      SELECT DISTINCT ("20210322" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20211011/query> {
      SELECT DISTINCT ("20211011" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20220217/query> {
      SELECT DISTINCT ("20220217" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20221026/query> {
      SELECT DISTINCT ("20221026" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230323/query> {
      SELECT DISTINCT ("20230323" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230428/query> {
      SELECT DISTINCT ("20230428" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230518/query> {
      SELECT DISTINCT ("20230518" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230615/query> {
      SELECT DISTINCT ("20230615" AS ?version) ?genre WHERE {
        ?s schema:genre ?genre .
      }
    }
  }
}
GROUP BY ?genre
ORDER BY ?genre
` >}}

- {{< yasgui-query yasgui-id="madb-lod-diff" title="エンティティのジャンル別増分"
query=`PREFIX schema: <https://schema.org/>

SELECT ?genre (COUNT(*) AS ?cnt)
{
  ?s schema:identifier ?identifier ;
     schema:genre ?genre .
  MINUS {
    # 比較対象のデータセット
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT * WHERE {
        ?s schema:identifier ?identifier .
      }
    }
  }
}
GROUP BY ?genre
ORDER BY DESC(COUNT(*))` >}}

- {{< yasgui-query yasgui-id="madb-lod-diff" title="マンガ分野: 所蔵館毎のアイテム数"
query=`PREFIX schema: <https://schema.org/>

SELECT ?providerName ?version ?cnt
{
  {
    SERVICE <https://sparql.metadata.moe/madb-20210125/query> {
      SELECT ("20210125" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class/CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20210322/query> {
      SELECT ("20210322" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class/CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20211011/query> {
      SELECT ("20211011" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class/CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20220217/query> {
      SELECT ("20220217" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class#CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20221026/query> {
      SELECT ("20221026" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class#CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230323/query> {
      SELECT ("20230323" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class#CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230428/query> {
      SELECT ("20230428" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class#CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230518/query> {
      SELECT ("20230518" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class#CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
  UNION
  {
    SERVICE <https://sparql.metadata.moe/madb-20230615/query> {
      SELECT ("20230615" AS ?version) ?providerName (COUNT(*) AS ?cnt) WHERE {
        ?s schema:additionalType <https://mediaarts-db.bunka.go.jp/data/class#CM> ;
           schema:provider [ schema:name ?providerName ] .
      }
      GROUP BY ?providerName
    }
  }
}
ORDER BY ?providerName ?version
` >}}

{{< yasgui id="madb-lod-diff"
    endpoint="https://sparql.metadata.moe/madb/query"
    endpoint-options="https://sparql.metadata.moe/madb/query,https://sparql.metadata.moe/madb-20210125/query,https://sparql.metadata.moe/madb-20210322/query,https://sparql.metadata.moe/madb-20211011/query,https://sparql.metadata.moe/madb-20220217/query,https://sparql.metadata.moe/madb-20221026/query,https://sparql.metadata.moe/madb-20230323/query,https://sparql.metadata.moe/madb-20230428/query,https://sparql.metadata.moe/madb-20230518/query,https://sparql.metadata.moe/madb-20230615/query"
default-query=`SELECT * WHERE {
  ?sub ?pred ?obj .
} LIMIT 10`
>}}
