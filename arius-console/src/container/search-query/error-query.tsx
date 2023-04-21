import React, { memo, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { SearchQueryForm } from "./components";
import { Tooltip } from "antd";
import { PERIOD_RADIO_MAP, errorQueryColumns } from "./config";
import { getErrorQueryList as getQueryList } from "api/search-query";
import { isSuperApp } from "lib/utils";
import { ProTable } from "knowdesign";
import { Drawer } from "antd";
import "./index.less";

const classPrefix = "error-query-container";

export const ErrorQuery = (props: any) => {
  const [queryParams, setQueryParams] = useState({
    queryIndex: undefined,
    startTime: undefined,
    endTime: undefined,
  });
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState({
    page: 1,
    size: 10,
  });
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [drawerData, setDrawerData] = useState();
  const isFirst = useRef(true);
  const totalLimit = 10000;

  const changeQueryParams = (params) => {
    setQueryParams({ ...params });
    page.page !== 1 && setPage({ ...page, page: 1 });
  };

  const getAsyncDataSource = async () => {
    try {
      setIsLoading(true);
      let params = {
        ...page,
        ...queryParams,
      };
      const res = await getQueryList(params as any);
      let dataSource = res?.bizData;
      if (!dataSource) {
        setDataSource([]);
        return;
      }
      dataSource?.forEach((item, index) => {
        item.key = index;
      });
      setDataSource(dataSource);
      console.log(dataSource, 95278);

      setTotal(res?.pagination.total);
    } catch (error) {
      setDataSource([]);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (pagination) => {
    setPage({
      page: pagination.current,
      size: pagination.pageSize,
    });
  };
  useEffect(() => {
    if (isFirst.current && !queryParams.startTime) {
      isFirst.current = false;
      return;
    }
    getAsyncDataSource();
  }, [queryParams, page]);
  const fn = (item) => {
    item = item.replace(/\+/g, '');
    return decodeURIComponent(item);
  };
  const showDrawer = (record: any) => {
    setDrawerData(record);
    console.log(record, 9527);
    let str =
      "/patent_basic/_search?%7B++++%22size%22%3A0%2C++++%22timeout%22%3A%2215s%22%2C++++%22query%22%3A++++%7B++++++%22bool%22%3A++++%7B++++++%22must%22%3A%5B+++++++++%7B+++++++++++%22query_string%22%3A+++++++++%7B++++++++++++%22query%22%3A%22industry_stgy_code_%5C%5C*%3A%28%5C%22F5%5C%22%29+AND+%28address_prov.text%3A%28%5C%22%E5%B9%BF%E4%B8%9C%E7%9C%81%5C%22%29+AND+address_city.text%3A%28%5C%22%E6%B7%B1%E5%9C%B3%E5%B8%82%5C%22%29%29%22%2C++++++++++++%22fields%22%3A%5B+++++++++++++++%22agent.text%5E1.0%22%2C+++++++++++++++%22agent_people.text%5E3.0%22%2C+++++++++++++++%22app_num_standard_all%5E1.0%22%2C+++++++++++++++%22app_person.text%5E5.0%22%2C++++++++++++++++%22app_person_standard.text%5E4.0%22%2C++++++++++++++++%22claims%5E5.0%22%2C++++++++++++++++%22designer.text%5E1.0%22%2C++++++++++++++++%22instruction%5E3.0%22%2C++++++++++++++++%22ipc*%5E1.0%22%2C%22loc*%5E1.0%22%2C++++++++++++++++%22out_num_all%5E1.0%22%2C++++++++++++++++%22patent_brief%5E12.0%22%2C++++++++++++++++%22patent_brief_en%5E7.0%22%2C++++++++++++++++%22patent_brief_zh%5E7.0%22%2C++++++++++++++++%22patent_name.text%5E25.0%22%2C++++++++++++++++%22patent_name_en%5E12.0%22%2C++++++++++++++++%22patent_name_zh%5E12.0%22%2C++++++++++++++++%22patent_person.text%5E5.0%22%2C++++++++++++++++%22patent_person_standard.text%5E5.0%22%2C++++++++++++++++%22person_all_short%5E1000.0%22+++++++++++++%5D%2C++++++++++++%22type%22%3A+%22best_fields%22%2C++++++++++++%22default_operator%22%3A%22and%22%2C++++++++++++%22max_determinized_states%22%3A10000%2C++++++++++++%22enable_position_increments%22%3Atrue%2C++++++++++++%22fuzziness%22%3A%22AUTO%22%2C++++++++++++%22fuzzy_prefix_length%22%3A0%2C++++++++++++%22fuzzy_max_expansions%22%3A50%2C++++++++++++%22phrase_slop%22%3A0%2C++++++++++++%22escape%22%3Afalse%2C++++++++++++%22auto_generate_synonyms_phrase_query%22%3Atrue%2C++++++++++++%22fuzzy_transpositions%22%3Atrue%2C++++++++++++%22boost%22%3A1.0++++++++%7D++++++++++++++%7D%5D%2C++++++++%22must_not%22%3A%5B+++++++++++%7B+++++++++++++%22term%22%3A++++++++++++++++%7B++++++++++++++++++%22text_ver%22%3A+++++++++++++++++++%7B+++++++++++++++++++++%22value%22%3A%22A%22%2C+++++++++++++++++++++%22boost%22%3A1.0+++++++++++++++++++++++++++++++%7D++++++++++++++++%7D++++++++++++%7D++++++++%5D%2C++++++++%22adjust_pure_negative%22%3Atrue%2C++++++++%22boost%22%3A1.0++++%7D++%7D%2C+++%22aggregations%22%3A++++%7B++++++%22_aggs%22%3A++++%7B++++++%22terms%22%3A++++++%7B++++++++%22field%22%3A%22ipc_main_group%22%2C++++++++%22size%22%3A5%2C++++++++%22shard_size%22%3A200%2C++++++++%22min_doc_count%22%3A0%2C++++++++%22shard_min_doc_count%22%3A0%2C++++++++%22show_term_doc_count_error%22%3Afalse%2C++++++++%22order%22%3A%5B++++++++++++%7B++++++++++++++%22_count%22%3A%22desc%22++++++++++++%7D%2C++++++++++++%7B++++++++++++++%22_key%22%3A%22asc%22++++++++++++%7D++++++++++%5D%2C++++++++++%22collect_mode%22%3A+%22breadth_first%22++++++%7D%2C++++++%22aggregations%22%3A++++++%7B++++++++%22_aggs%22%3A++++++++%7B++++++++++%22terms%22%3A++++++++++%7B++++++++++++%22field%22%3A%22app_year%22%2C++++++++++++%22size%22%3A5%2C++++++++++++%22min_doc_count%22%3A0%2C++++++++++++%22shard_min_doc_count%22%3A0%2C++++++++++++%22show_term_doc_count_error%22%3Afalse%2C++++++++++++%22order%22%3A++++++++++++%7B++++++++++++++%22_key%22%3A%22asc%22++++++++++++%7D%2C++++++++++++%22include%22%3A%5B%222019%22%2C%222020%22%2C%222021%22%2C%222022%22%2C%222023%22%5D++++++++++%7D++++++++++++++++++%7D++++++++++++++%7D++++++++++%7D++++++%7D%7D=";

    console.log(fn(str),66666,str);

    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    props?.menu === "error-query" && getAsyncDataSource();
  }, [props?.menu]);

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-query`}>
        <SearchQueryForm
          setSearchQuery={changeQueryParams}
          value={"error-query"}
        />
      </div>

      <div className={`${classPrefix}-table`}>
        <ProTable
          showQueryForm={false}
          tableProps={{
            tableId: "error_search_query_table",
            isCustomPg: false,
            showHeader: false,
            loading: isLoading,
            rowKey: "key",
            dataSource: dataSource,
            columns: errorQueryColumns(isSuperApp(), showDrawer),
            paginationProps: {
              total: total > totalLimit ? totalLimit : total,
              current: page.page,
              pageSize: page.size,
              pageSizeOptions: ["10", "20", "50", "100", "200", "500"],
              showTotal: (total) => `共 ${total} 条`,
              itemRender: (
                pagination,
                type: "page" | "prev" | "next",
                originalElement
              ) => {
                const lastPage = totalLimit / page.size;
                if (type === "page") {
                  if (total > totalLimit && pagination === lastPage) {
                    return (
                      <Tooltip
                        title={`考虑到性能问题，只展示${totalLimit}条数据`}
                      >
                        {pagination}
                      </Tooltip>
                    );
                  } else {
                    return pagination;
                  }
                } else {
                  return originalElement;
                }
              },
            },
            attrs: {
              scroll: { x: "max-content" },
              onChange: handleChange,
            },
          }}
        />
      </div>
      <Drawer
        title={"错误信息详情"}
        width={578}
        visible={visible}
        maskClosable={true}
        onClose={onClose}
        bodyStyle={{ padding: "24pxs" }}
      >
        <p>{drawerData}</p>
      </Drawer>
    </div>
  );
};
