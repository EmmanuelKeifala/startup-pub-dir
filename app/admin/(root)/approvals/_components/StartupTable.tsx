"use client";
import React, { useRef, useState, FC } from "react";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  ConfigProvider,
  Tag,
  Tooltip,
  Avatar,
  Badge,
  Card,
  Typography,
} from "antd";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Startup } from "@/types/general";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import shadcn Dropdown
import { useRouter } from "next/navigation";
import db from "@/database/drizzle";
import { startups } from "@/database/schema";
import { toast } from "sonner";

const { Title, Text } = Typography;

type StartupStatus = "pending" | "approved" | "rejected";

interface StartupTableProps {
  data: Startup[];
}

interface TableStartupData {
  key: string;
  name: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  email: string;
  status: StartupStatus;
}

interface EmptyStateProps {
  text: string;
}

const StartupTable: FC<StartupTableProps> = ({ data }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const searchInput = useRef<InputRef>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const validData = Array.isArray(data) ? data : [];

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string
  ): void => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
    setSearchText("");
  };

  const handleApprove = async (record: TableStartupData): Promise<void> => {
    await db.update(startups).set({
      status: "approved",
    });

    toast.success(`Startup ${record.name} approved!`);
  };

  const handleReject = async (record: TableStartupData): Promise<void> => {
    await db.update(startups).set({
      status: "rejected",
    });
    toast.info(`Startup ${record.name} rejected!`);
  };

  const handleView = (record: TableStartupData): void => {
    router.push(`/startup/${record.key}`);
  };

  const getColumnSearchProps = (
    dataIndex: keyof TableStartupData
  ): ColumnType<TableStartupData> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex as string)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys as string[],
                confirm,
                dataIndex as string
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0] as string);
              setSearchedColumn(dataIndex as string);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: boolean | React.Key, record: TableStartupData) => {
      if (typeof value === "boolean") {
        return value;
      }

      const dataValue = record[dataIndex];
      return dataValue
        ? dataValue
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    const starChar = "★";
    const emptyStarChar = "☆";

    let stars = starChar.repeat(fullStars);
    if (decimal >= 0.5) stars += "½";
    const remaining = 5 - Math.ceil(rating);
    if (remaining > 0) stars += emptyStarChar.repeat(remaining);

    return (
      <Text style={{ color: "#faad14", fontSize: "16px" }}>
        {stars}{" "}
        <Text style={{ color: "#888", fontSize: "14px" }}>
          ({rating.toFixed(1)})
        </Text>
      </Text>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "#1890ff",
      "#52c41a",
      "#faad14",
      "#f5222d",
      "#722ed1",
      "#13c2c2",
      "#eb2f96",
      "#fadb14",
    ];

    const nameSum = name
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[nameSum % colors.length];
  };

  const columns: ColumnType<TableStartupData>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (name: string) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: getRandomColor(name),
              verticalAlign: "middle",
            }}
          >
            {getInitials(name)}
          </Avatar>
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ...getColumnSearchProps("category"),
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (category: string) => (
        <Tag color="blue" style={{ padding: "4px 8px", borderRadius: "16px" }}>
          {category}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description.length > 50
            ? `${description.substring(0, 50)}...`
            : description}
        </Tooltip>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ...getColumnSearchProps("location"),
      sorter: (a, b) => a.location.localeCompare(b.location),
      render: (location: string) => (
        <Space>
          <span style={{ fontSize: "16px" }}>📍</span>
          {location}
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      render: (rating: number) => getRatingStars(rating),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      render: (email: string) => (
        <a href={`mailto:${email}`} style={{ color: "#1890ff" }}>
          {email}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value: boolean | React.Key, record: TableStartupData) =>
        record.status === (value as StartupStatus),
      render: (status: StartupStatus) => {
        const statusColors = {
          pending: "#faad14",
          approved: "#52c41a",
          rejected: "#f5222d",
        };

        return (
          <Badge
            color={statusColors[status]}
            text={
              <Text strong>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            }
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: TableStartupData) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="text" icon={<MoreOutlined />} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleView(record)}>
              <EyeOutlined />
              View Details
            </DropdownMenuItem>
            {record.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => handleApprove(record)}>
                  <CheckCircleOutlined />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReject(record)}>
                  <CloseCircleOutlined />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const tableData: TableStartupData[] = validData.map((item) => ({
    key: item.id,
    name: item.name || "N/A",
    category: item.categoryName || "N/A",
    description: item.description || "N/A",
    location: item.location || "N/A",
    rating: item.rating || 0,
    email: item.email || "N/A",
    status: item.status as StartupStatus,
  }));

  const EmptyState: FC<EmptyStateProps> = ({ text }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 text-xl mb-4">
        <span className="text-3xl">📊</span>
      </div>
      <div className="text-gray-500 text-xl mb-2 font-semibold">
        No data available
      </div>
      <p className="text-gray-400">{text}</p>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
        components: {
          Table: {
            headerBg: "#f5f5f5",
            headerColor: "#262626",
            borderRadius: 8,
            rowHoverBg: "#f0f8ff",
          },
          Card: {
            boxShadow: "0 6px 16px -8px rgba(0, 0, 0, 0.08)",
          },
        },
      }}
    >
      <Card
        id="startup-table"
        ref={tableRef}
        style={{ borderRadius: "12px" }}
        className="shadow-md"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} style={{ margin: 0 }}>
              Startup Applications
            </Title>
          </div>
        }
      >
        <Table<TableStartupData>
          columns={columns}
          dataSource={tableData}
          scroll={{ x: "100%" }}
          pagination={{
            pageSize: 5,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
          locale={{
            emptyText: (
              <EmptyState
                text={"No startup data available. Please add some startups."}
              />
            ),
          }}
          rowClassName={(record) =>
            record.status === "approved"
              ? "bg-green-50"
              : record.status === "rejected"
              ? "bg-red-50"
              : ""
          }
        />
      </Card>
    </ConfigProvider>
  );
};

export default StartupTable;
