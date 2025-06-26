import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSpace } from "@/providers/space.provider";
import { api } from "@/api";

const { Option } = Select;


interface Space {
  id: string;
  code: string;
  name: string;
  notes?: string;
  address?: string;
  parent: Space;
  parent_type?: string;
  parent_id?: number | string;
}


const SpaceSelector = () => {
  // handle space
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const {spaceId, setSpaceId } = useSpace();

  interface ApiResponse {
    data: any;
    success: boolean;
    message: string;
  }

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const response = await api.get("spaces/data", {
        searchParams: {
          include_self: true,
          include_parent: true,
        },
      });
      const data: ApiResponse = await response.json();
      setSpaces(data.data);

      console.log("data", data);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string | null) => {
    const finalValue = value === "" ? null : value;
    setSpaceId(finalValue);

    window.location.reload();
  };

  useEffect(() => {
    fetchSpaces();
  }, []);


  return (
    <Select
      placeholder="Pilih Lahan"
      onChange={handleChange}
      loading={loading}
      style={{ width: 200 }}
      value={spaceId || ""}
      allowClear
    >
        <Select.Option value="">Lobby</Select.Option>
      {spaces.map((s) => (
        <Select.Option key={s.id} value={s.id}>
          {s.id} : {s.name}
        </Select.Option>
      ))}
    </Select>
  );
}

export { SpaceSelector };